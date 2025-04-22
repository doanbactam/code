"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@m4v/db"
import { ToolStatus } from "@m4v/db/client"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { isProd } from "~/env"
import { generateContent, generateContentWithRelations, connectOrCreateTopics } from "~/lib/generate-content"
import { removeS3Directories, uploadFavicon, uploadScreenshot } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/schemas"
import { inngest } from "~/services/inngest"
import { env } from "~/env"

export const createTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, topics, ...input } }) => {
    // Nếu có website URL và không có nội dung, tạo nội dung tự động
    let contentData = {}
    if (input.websiteUrl && (!input.tagline || !input.description || !input.content)) {
      try {
        const { categories: detectedCategories, alternatives: detectedAlternatives, topics: detectedTopics, pricingType, ...content } = await generateContentWithRelations(
          input.websiteUrl
        )
        
        // Sử dụng nội dung được tạo nếu không có nội dung tương ứng
        contentData = {
          tagline: input.tagline || content.tagline,
          description: input.description || content.description,
          content: input.content || content.content,
          pricingType: input.pricingType || pricingType
        }
        
        // Sử dụng danh mục, alternatives và topics được phát hiện nếu chưa được cung cấp
        if (!categories?.length) {
          categories = detectedCategories.map(c => c.id)
        }
        
        if (!alternatives?.length) {
          alternatives = detectedAlternatives.map(a => a.id)
        }
        
        if (!topics?.length) {
          topics = detectedTopics
        }
      } catch (error) {
        console.error("Error generating content:", error)
      }
    }

    // Tạo hoặc kết nối topics
    const topicConnections = topics ? await connectOrCreateTopics(topics) : undefined

    const tool = await db.tool.create({
      data: {
        ...input,
        ...contentData,
        slug: input.slug || slugify(input.name),
        alternatives: alternatives?.length ? { connect: alternatives.map(id => ({ id })) } : undefined,
        categories: categories?.length ? { connect: categories.map(id => ({ id })) } : undefined,
        topics: topics?.length ? { connectOrCreate: topicConnections } : undefined,
      },
    })

    // Send an event to the Inngest pipeline
    if (tool.publishedAt) {
      isProd && (await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } }))
    }

    return tool
  })

export const updateTool = adminProcedure
  .createServerAction()
  .input(toolSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, alternatives, categories, topics, ...input } }) => {
    // Tạo hoặc cập nhật topics
    const topicConnections = topics ? await connectOrCreateTopics(topics) : undefined

    const tool = await db.tool.update({
      where: { id },
      data: {
        ...input,
        alternatives: alternatives ? { set: alternatives.map(id => ({ id })) } : undefined,
        categories: categories ? { set: categories.map(id => ({ id })) } : undefined,
        topics: topics ? { set: [], connectOrCreate: topicConnections } : undefined,
      },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)
    revalidateTag("topics")

    return tool
  })

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/tools")
    revalidateTag("tools")

    // Remove the tool images from S3 asynchronously
    after(async () => {
      await removeS3Directories(tools.map(tool => `tools/${tool.slug}`))
    })

    return true
  })

export const scheduleTool = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string(), publishedAt: z.coerce.date() }))
  .handler(async ({ input: { id, publishedAt } }) => {
    const tool = await db.tool.update({
      where: { id },
      data: { status: ToolStatus.Scheduled, publishedAt },
    })

    revalidateTag("schedule")
    revalidateTag(`tool-${tool.slug}`)

    // Send an event to the Inngest pipeline
    isProd && (await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } }))

    return true
  })

export const reuploadToolAssets = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    const [faviconUrl, screenshotUrl] = await Promise.all([
      uploadFavicon(tool.websiteUrl, `tools/${tool.slug}/favicon`),
      uploadScreenshot(tool.websiteUrl, `tools/${tool.slug}/screenshot`),
    ])

    await db.tool.update({
      where: { id: tool.id },
      data: { faviconUrl, screenshotUrl },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return true
  })

export const regenerateToolContent = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })
    const { categories, alternatives, topics, pricingType, ...content } = await generateContentWithRelations(
      tool.websiteUrl
    )

    // Tạo hoặc kết nối topics
    const topicConnections = await connectOrCreateTopics(topics)

    await db.tool.update({
      where: { id: tool.id },
      data: {
        ...content,
        pricingType,
        categories: { connect: categories.map(({ id }) => ({ id })) },
        alternatives: { connect: alternatives.map(({ id }) => ({ id })) },
        topics: { connectOrCreate: topicConnections },
      },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)
    revalidateTag("topics")

    return true
  })

export const fetchSimilarWebData = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })
    
    // Kiểm tra xem API key có tồn tại không
    if (!env.SIMILARWEB_API_KEY) {
      throw new Error("Chưa cấu hình SIMILARWEB_API_KEY trong biến môi trường")
    }
    
    // Import needed here to avoid circular dependencies
    const { getToolWebsiteData } = await import("~/lib/websites")
    const data = await getToolWebsiteData(tool.websiteUrl)
    
    if (!data) {
      throw new Error("Không thể lấy dữ liệu từ SimilarWeb")
    }

    await db.tool.update({
      where: { id: tool.id },
      data,
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return true
  })

export const batchReuploadToolAssets = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true, websiteUrl: true },
    })

    const results = await Promise.all(
      tools.map(async (tool) => {
        try {
          const [faviconUrl, screenshotUrl] = await Promise.all([
            uploadFavicon(tool.websiteUrl, `tools/${tool.slug}/favicon`),
            uploadScreenshot(tool.websiteUrl, `tools/${tool.slug}/screenshot`),
          ])

          await db.tool.update({
            where: { id: tool.id },
            data: { faviconUrl, screenshotUrl },
          })

          return { id: tool.id, success: true }
        } catch (error) {
          console.error(`Error reuploading assets for tool ${tool.id}:`, error)
          return { id: tool.id, success: false, error: String(error) }
        }
      })
    )

    revalidateTag("tools")
    results.forEach((result) => {
      if (result.success) {
        const tool = tools.find((t) => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    })

    const successCount = results.filter((r) => r.success).length
    if (successCount === 0) {
      throw new Error("Không thể tải lại hình ảnh cho bất kỳ công cụ nào")
    }

    return {
      success: true,
      totalCount: ids.length,
      successCount,
      failedCount: ids.length - successCount,
    }
  })

export const batchRegenerateToolContent = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true, websiteUrl: true },
    })

    const results = await Promise.all(
      tools.map(async (tool) => {
        try {
          const { categories, alternatives, topics, pricingType, ...content } = await generateContentWithRelations(
            tool.websiteUrl
          )

          // Tạo hoặc kết nối topics
          const topicConnections = await connectOrCreateTopics(topics)

          await db.tool.update({
            where: { id: tool.id },
            data: {
              ...content,
              pricingType,
              categories: { connect: categories.map(({ id }) => ({ id })) },
              alternatives: { connect: alternatives.map(({ id }) => ({ id })) },
              topics: { connectOrCreate: topicConnections },
            },
          })

          return { id: tool.id, success: true }
        } catch (error) {
          console.error(`Error regenerating content for tool ${tool.id}:`, error)
          return { id: tool.id, success: false, error: String(error) }
        }
      })
    )

    revalidateTag("tools")
    revalidateTag("topics")
    results.forEach((result) => {
      if (result.success) {
        const tool = tools.find((t) => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    })

    const successCount = results.filter((r) => r.success).length
    if (successCount === 0) {
      throw new Error("Không thể tạo lại nội dung cho bất kỳ công cụ nào")
    }

    return {
      success: true,
      totalCount: ids.length,
      successCount,
      failedCount: ids.length - successCount,
    }
  })

export const batchFetchSimilarWebData = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    // Kiểm tra xem API key có tồn tại không
    if (!env.SIMILARWEB_API_KEY) {
      throw new Error("Chưa cấu hình SIMILARWEB_API_KEY trong biến môi trường")
    }
    
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true, websiteUrl: true },
    })

    // Import needed here to avoid circular dependencies
    const { getToolWebsiteData } = await import("~/lib/websites")

    const results = await Promise.all(
      tools.map(async (tool) => {
        try {
          const data = await getToolWebsiteData(tool.websiteUrl)
          
          if (!data) {
            return { id: tool.id, success: false, error: "Không thể lấy dữ liệu từ SimilarWeb" }
          }

          await db.tool.update({
            where: { id: tool.id },
            data,
          })

          return { id: tool.id, success: true }
        } catch (error) {
          // Tĩnh lặng khi có lỗi
          return { id: tool.id, success: false, error: String(error) }
        }
      })
    )

    revalidateTag("tools")
    results.forEach((result) => {
      if (result.success) {
        const tool = tools.find((t) => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    })

    const successCount = results.filter((r) => r.success).length
    if (successCount === 0) {
      throw new Error("Không thể lấy dữ liệu SimilarWeb cho bất kỳ công cụ nào")
    }

    return {
      success: true,
      totalCount: ids.length,
      successCount,
      failedCount: ids.length - successCount,
    }
  })


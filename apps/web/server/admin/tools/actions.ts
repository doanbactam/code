"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@m4v/db"
import { ToolStatus } from "@m4v/db/client"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { isProd } from "~/env"
import { env } from "~/env"
import {
  connectOrCreateTopics,
  generateContent,
  generateContentWithRelations,
} from "~/lib/generate-content"
import { removeS3Directories, uploadFavicon, uploadScreenshot } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/schemas"
import { inngest } from "~/services/inngest"

export const createTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, topics, ...input } }) => {
    try {
      // Đảm bảo tạo slug nếu không có
      const slug = input.slug || slugify(input.name)

      // Tạo hoặc kết nối topics nếu đã được cung cấp
      const topicConnections = topics ? await connectOrCreateTopics(topics) : undefined

      // Tạo tool với dữ liệu cơ bản
      const tool = await db.tool.create({
        data: {
          ...input,
          slug,
          alternatives: alternatives?.length
            ? { connect: alternatives.map(id => ({ id })) }
            : undefined,
          categories: categories?.length ? { connect: categories.map(id => ({ id })) } : undefined,
          topics: topics?.length ? { connectOrCreate: topicConnections } : undefined,
        },
      })

      // Send an event to the Inngest pipeline
      if (tool.publishedAt) {
        isProd && (await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } }))
      }

      // Generate content và cập nhật tài sản bất đồng bộ
      after(async () => {
        try {
          // Chỉ generate content nếu có website URL và thiếu nội dung
          if (input.websiteUrl && (!input.tagline || !input.description || !input.content)) {
            try {
              console.log(`Generating content for tool ${tool.id} from ${input.websiteUrl}...`)
              const {
                categories: detectedCategories,
                alternatives: detectedAlternatives,
                topics: detectedTopics,
                pricingType,
                ...content
              } = await generateContentWithRelations(input.websiteUrl)

              // Dữ liệu cập nhật cho tool
              const contentData: any = {}

              // Chỉ cập nhật các trường còn thiếu
              if (!input.tagline) contentData.tagline = content.tagline
              if (!input.description) contentData.description = content.description
              if (!input.content) contentData.content = content.content
              if (!input.pricingType) contentData.pricingType = pricingType

              // Mảng các quan hệ cần cập nhật
              const relationUpdates: any = {}

              // Chỉ cập nhật danh mục nếu chưa được cung cấp
              if (!categories?.length && detectedCategories.length) {
                relationUpdates.categories = {
                  connect: detectedCategories.map(({ id }) => ({ id })),
                }
              }

              // Chỉ cập nhật alternatives nếu chưa được cung cấp
              if (!alternatives?.length && detectedAlternatives.length) {
                relationUpdates.alternatives = {
                  connect: detectedAlternatives.map(({ id }) => ({ id })),
                }
              }

              // Chỉ cập nhật topics nếu chưa được cung cấp
              if (!topics?.length && detectedTopics.length) {
                const topicConnections = await connectOrCreateTopics(detectedTopics)
                relationUpdates.topics = {
                  connectOrCreate: topicConnections,
                }
              }

              // Cập nhật tool với nội dung mới
              await db.tool.update({
                where: { id: tool.id },
                data: {
                  ...contentData,
                  ...relationUpdates,
                },
              })

              console.log(`Content generated and updated for tool ${tool.id}`)
            } catch (error) {
              console.error("Error generating content:", error)
            }
          }

          // Tải favicon và screenshot nếu cần
          if (input.websiteUrl && (!input.faviconUrl || !input.screenshotUrl)) {
            try {
              console.log(`Uploading assets for tool ${tool.id} from ${input.websiteUrl}...`)
              const [faviconUrl, screenshotUrl] = await Promise.all([
                !input.faviconUrl
                  ? uploadFavicon(input.websiteUrl, `tools/${slug}/favicon`)
                  : Promise.resolve(input.faviconUrl),
                !input.screenshotUrl
                  ? uploadScreenshot(input.websiteUrl, `tools/${slug}/screenshot`)
                  : Promise.resolve(input.screenshotUrl),
              ])

              await db.tool.update({
                where: { id: tool.id },
                data: { faviconUrl, screenshotUrl },
              })

              console.log(`Assets uploaded for tool ${tool.id}`)
            } catch (error) {
              console.error(`Error uploading assets for tool ${tool.id}:`, error)
            }
          }

          // Revalidate cache cho tool
          revalidateTag("tools")
          revalidateTag(`tool-${tool.slug}`)
          revalidateTag("topics")
        } catch (error) {
          console.error(`Error in background processing for tool ${tool.id}:`, error)
        }
      })

      return tool
    } catch (error) {
      console.error("Error creating tool:", error)
      throw new Error(
        `Không thể tạo công cụ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
      )
    }
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
        lastUpdated: new Date(),
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
      data: { 
        status: ToolStatus.Scheduled, 
        publishedAt,
        lastUpdated: new Date(),
      },
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
      data: { 
        faviconUrl, 
        screenshotUrl,
        lastUpdated: new Date(),
      },
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
    const { categories, alternatives, topics, pricingType, ...content } =
      await generateContentWithRelations(tool.websiteUrl)

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
        lastUpdated: new Date(),
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
      data: {
        ...data,
        lastUpdated: new Date(),
      },
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
      tools.map(async tool => {
        try {
          const [faviconUrl, screenshotUrl] = await Promise.all([
            uploadFavicon(tool.websiteUrl, `tools/${tool.slug}/favicon`),
            uploadScreenshot(tool.websiteUrl, `tools/${tool.slug}/screenshot`),
          ])

          await db.tool.update({
            where: { id: tool.id },
            data: { 
              faviconUrl, 
              screenshotUrl,
              lastUpdated: new Date(),
            },
          })

          return { id: tool.id, success: true }
        } catch (error) {
          console.error(`Error reuploading assets for tool ${tool.id}:`, error)
          return { id: tool.id, success: false, error: String(error) }
        }
      }),
    )

    revalidateTag("tools")
    for (const result of results) {
      if (result.success) {
        const tool = tools.find(t => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    }

    const successCount = results.filter(r => r.success).length
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
      tools.map(async tool => {
        try {
          const { categories, alternatives, topics, pricingType, ...content } =
            await generateContentWithRelations(tool.websiteUrl)

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
      }),
    )

    revalidateTag("tools")
    revalidateTag("topics")
    for (const result of results) {
      if (result.success) {
        const tool = tools.find(t => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    }

    const successCount = results.filter(r => r.success).length
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
      tools.map(async tool => {
        try {
          const data = await getToolWebsiteData(tool.websiteUrl)

          if (!data) {
            return { id: tool.id, success: false, error: "Không thể lấy dữ liệu từ SimilarWeb" }
          }

          await db.tool.update({
            where: { id: tool.id },
            data: {
              ...data,
              lastUpdated: new Date(),
            },
          })

          return { id: tool.id, success: true }
        } catch (error) {
          // Tĩnh lặng khi có lỗi
          return { id: tool.id, success: false, error: String(error) }
        }
      }),
    )

    revalidateTag("tools")
    for (const result of results) {
      if (result.success) {
        const tool = tools.find(t => t.id === result.id)
        if (tool) revalidateTag(`tool-${tool.slug}`)
      }
    }

    const successCount = results.filter(r => r.success).length
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

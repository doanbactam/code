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

export const createTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, topics, ...input } }) => {
    // Tạo hoặc kết nối topics
    const topicConnections = topics ? await connectOrCreateTopics(topics) : undefined

    const tool = await db.tool.create({
      data: {
        ...input,
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
    const { categories, alternatives, topics, ...content } = await generateContentWithRelations(
      tool.websiteUrl
    )

    // Tạo hoặc kết nối topics
    const topicConnections = await connectOrCreateTopics(topics)

    await db.tool.update({
      where: { id: tool.id },
      data: {
        ...content,
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


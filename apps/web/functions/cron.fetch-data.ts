import { ToolStatus } from "@m4v/db/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { fetchAnalyticsInBatches } from "~/lib/analytics"
import { getMilestoneReached } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { getPostMilestoneTemplate, getPostTemplate, sendSocialPost } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { inngest } from "~/services/inngest"
import { tryCatch } from "~/utils/helpers"

export const fetchData = inngest.createFunction(
  { id: "fetch-data", retries: 0 },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" }, // Every day at midnight

  async ({ step, db, logger }) => {
    const [tools, alternatives] = await Promise.all([
      step.run("fetch-tools", async () => {
        return await db.tool.findMany({
          where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
        })
      }),

      step.run("fetch-alternatives", async () => {
        return await db.alternative.findMany()
      }),
    ])

    await Promise.all([
      // Fetch tool analytics data
      step.run("fetch-tool-analytics-data", async () => {
        await fetchAnalyticsInBatches({
          data: tools.filter(isToolPublished),
          pathPrefix: "/",
          logger,
          onSuccess: async (id, data) => {
            await db.tool.update({ where: { id }, data })
          },
        })
      }),

      // Fetch alternative analytics data
      step.run("fetch-alternative-analytics-data", async () => {
        await fetchAnalyticsInBatches({
          data: alternatives,
          pathPrefix: "/alternatives/",
          logger,
          onSuccess: async (id, data) => {
            await db.alternative.update({ where: { id }, data })
          },
        })
      }),
    ])

    // Post on Socials about a random tool
    await step.run("post-on-socials", async () => {
      const publishedTools = tools.filter(isToolPublished)
      const tool = publishedTools[Math.floor(Math.random() * publishedTools.length)]

      if (tool) {
        const template = await getPostTemplate(tool)
        const result = await tryCatch(sendSocialPost(template, tool))

        if (result.error) {
          throw new NonRetriableError(
            result.error instanceof Error ? result.error.message : "Unknown error",
          )
        }

        return result.data
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
    })
  },
)

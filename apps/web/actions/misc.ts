"use server"

import { db } from "@m4v/db"
import { ToolStatus } from "@m4v/db/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { getToolRepositoryData } from "~/lib/repositories"
import { adminProcedure } from "~/lib/safe-actions"
import { getPostTemplate, sendSocialPost } from "~/lib/socials"
import { tryCatch } from "~/utils/helpers"

export const testSocialPosts = adminProcedure
  .createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input: { slug } }) => {
    const tool = await db.tool.findFirst({ where: { slug } })

    if (tool) {
      const template = await getPostTemplate(tool)
      return sendSocialPost(template, tool)
    }
  })

export const fetchRepositoryData = adminProcedure.createServerAction().handler(async () => {
  return { success: true, message: "Repository data fetch skipped - GitHub integration removed" }
})

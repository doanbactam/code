import { PricingType, type Tool, ToolStatus } from "@m4v/db/client"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const toolsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  sort: getSortingStateParser<Tool>().withDefault([{ id: "createdAt", desc: true }]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  status: parseAsArrayOf(z.nativeEnum(ToolStatus)).withDefault([]),
}

export const toolsTableParamsCache = createSearchParamsCache(toolsTableParamsSchema)
export type ToolsTableSchema = Awaited<ReturnType<typeof toolsTableParamsCache.parse>>

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().min(1, "Website is required").url(),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.string().optional().or(z.literal("")),
  screenshotUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal("")),
  submitterNote: z.string().optional(),
  hostingUrl: z.string().url().optional().or(z.literal("")),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  pricingType: z.nativeEnum(PricingType).optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  alternatives: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
})

export type ToolSchema = z.infer<typeof toolSchema>

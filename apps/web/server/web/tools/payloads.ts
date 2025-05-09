import { Prisma } from "@m4v/db/client"
import { alternativeManyPayload } from "~/server/web/alternatives/payloads"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { topicManyPayload } from "~/server/web/topics/payloads"

export const toolAlternativesPayload = Prisma.validator<Prisma.Tool$alternativesArgs>()({
  select: alternativeManyPayload,
  orderBy: [{ tools: { _count: "desc" } }, { isFeatured: "desc" }, { name: "asc" }],
})

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
})

export const toolTopicsPayload = Prisma.validator<Prisma.Tool$topicsArgs>()({
  select: topicManyPayload,
  orderBy: { slug: "asc" },
})

export const toolOnePayload = {
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  tagline: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  isFeatured: true,
  hostingUrl: true,
  discountCode: true,
  discountAmount: true,
  pricingType: true,
  status: true,
  // SimilarWeb data
  globalRank: true,
  monthlyVisits: true,
  lastUpdated: true,
  // Standard fields
  publishedAt: true,
  updatedAt: true,
  ownerId: true,
  alternatives: toolAlternativesPayload,
  categories: toolCategoriesPayload,
  topics: toolTopicsPayload,
}

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  tagline: true,
  description: true,
  monthlyVisits: true,
  globalRank: true,
  faviconUrl: true,
  discountCode: true,
  discountAmount: true,
  pricingType: true,
  lastUpdated: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  alternatives: { ...toolAlternativesPayload, take: 1 },
})

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
  pricingType: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  categories: toolCategoriesPayload,
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>

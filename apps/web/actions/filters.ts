"use server"

import { createServerAction } from "zsa"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findPricingTypes } from "~/server/web/pricing-types/queries"
import type { FilterOption } from "~/types/search"

interface FilterResult {
  slug: string
  name: string
  _count: { tools: number }
}

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([
    findAlternatives({}),
    findCategories({}),
    findPricingTypes(),
  ])

  // Map the filters to the expected format
  const [alternative, category, pricingType] = filters.map((r: FilterResult[]) =>
    r.map(({ slug, name, _count }): FilterOption => ({ slug, name, count: _count.tools })),
  )

  return { alternative, category, pricingType } as const
})

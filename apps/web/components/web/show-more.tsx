"use client"

import { type ReactNode, useState } from "react"
import { Button } from "~/components/common/button"
import { Stack } from "~/components/common/stack"
import { navLinkVariants } from "~/components/web/ui/nav-link"

export type ShowMoreProps<T> = {
  items: T[]
  renderItem: (item: T) => ReactNode
  limit?: number
  className?: string
}

export const ShowMore = <T,>({ items, renderItem, limit = 4, className }: ShowMoreProps<T>) => {
  const [showAll, setShowAll] = useState(false)

  const shouldShowAll = showAll || items.length <= limit + 1
  const visibleItems = shouldShowAll ? items : items.slice(0, limit)
  const hiddenCount = items.length - limit

  if (!items.length) return null

  return (
    <Stack className={className}>
      {visibleItems.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}

      {!shouldShowAll && hiddenCount > 0 && (
        <Button type="button" className={navLinkVariants()} onClick={() => setShowAll(true)}>
          +{hiddenCount} hiển thị thêm
        </Button>
      )}
    </Stack>
  )
}

"use client"

import { useLocalStorage } from "@mantine/hooks"
import { cx } from "cva"
import { AnimatedContainer } from "~/components/common/animated-container"
import { Icon } from "~/components/common/icon"
import { Input } from "~/components/common/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { useFilters } from "~/contexts/filter-context"

export type ToolSearchProps = {
  placeholder?: string
}

export const ToolSearch = ({ placeholder }: ToolSearchProps) => {
  const { filters, isLoading, enableSort, enableFilters, updateFilters } = useFilters()

  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage({
    key: "oa-filters-open",
    defaultValue: false,
  })

  const sortOptions = [
    { value: "publishedAt.desc", label: "Mới nhất" },
    { value: "pageviews.desc", label: "Phổ biến nhất" },
    { value: "name.asc", label: "Tên (A to Z)" },
    { value: "name.desc", label: "Tên (Z to A)" },
    { value: "score.desc", label: "Điểm số" },
    { value: "globalRank.asc", label: "Xếp hạng thế giới" },
    { value: "lastUpdated.desc", label: "Cập nhật gần đây" },
    // { value: "createdAt.desc", label: "Đăng ký gần đây" },
  ]

  return (
    <div className="w-full">
      <Stack className="w-full">
        <div className="relative grow min-w-0">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
            {isLoading ? (
              <Icon name="lucide/loader" className="animate-spin" />
            ) : (
              <Icon name="lucide/search" />
            )}
          </div>

          <Input
            size="lg"
            value={filters.q || ""}
            onChange={e => updateFilters({ q: e.target.value })}
            placeholder={isLoading ? "Đang tải..." : placeholder || "Tìm kiếm công cụ..."}
            className="w-full truncate px-10"
          />

          {enableFilters && (
            <button
              type="button"
              className={cx(
                "absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-2 py-1.5 px-2.5 rounded-md",
                isFiltersOpen
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              onClick={() => setIsFiltersOpen(prev => !prev)}
            >
              <Icon name="lucide/list-filter" className="size-4" />
              <span className="text-sm leading-none max-sm:sr-only">Bộ lọc</span>
            </button>
          )}
        </div>

        {enableSort && (
          <Select value={filters.sort} onValueChange={sort => updateFilters({ sort })}>
            <SelectTrigger
              size="lg"
              className="w-auto min-w-36 max-sm:flex-1"
              aria-label="Sắp xếp theo"
            >
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>

            <SelectContent align="end">
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Stack>

      <AnimatedContainer height className="w-full">
        {enableFilters && isFiltersOpen && <ToolFilters className="pt-3" />}
      </AnimatedContainer>
    </div>
  )
}

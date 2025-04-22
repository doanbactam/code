import { type ComponentProps, type ReactElement, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { Badge } from "~/components/common/badge"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Separator } from "~/components/common/separator"
import { cx } from "~/utils/cva"

export type BadgeItem = {
  id: string
  element: ReactElement
  priority?: number // Ưu tiên hiển thị, càng cao càng được hiển thị
}

type BadgeGroupProps = ComponentProps<typeof Stack> & {
  /**
   * Danh sách các badge cần hiển thị
   */
  badges: BadgeItem[]
  
  /**
   * Số lượng badge tối đa hiển thị trực tiếp
   * @default 2
   */
  maxVisible?: number
  
  /**
   * Nội dung hiển thị khi không có badge nào
   */
  emptyContent?: ReactNode
  
  /**
   * Cho phép hiển thị số lượng badge còn lại thay vì hiển thị dropdown
   * @default false
   */
  showCount?: boolean
}

export const BadgeGroup = ({
  badges,
  maxVisible = 2,
  emptyContent,
  showCount = false,
  className,
  ...props
}: BadgeGroupProps) => {
  if (!badges.length) {
    return emptyContent ? (
      <Stack className={cx("justify-end", className)} {...props}>
        {emptyContent}
      </Stack>
    ) : null
  }

  // Sắp xếp badge theo độ ưu tiên
  const sortedBadges = [...badges].sort((a, b) => (b.priority || 0) - (a.priority || 0))
  
  // Phần hiển thị trực tiếp
  const visibleBadges = sortedBadges.slice(0, maxVisible)
  
  // Phần hiển thị trong popover
  const hiddenBadges = sortedBadges.slice(maxVisible)
  
  return (
    <Stack 
      size="sm"
      wrap={false}
      className={cx("justify-end text-sm", className)}
      {...props}
    >
      {visibleBadges.map((badge) => (
        <div key={badge.id}>{badge.element}</div>
      ))}
      
      {hiddenBadges.length > 0 && (
        showCount ? (
          <Badge size="sm" variant="soft" className="rounded-full px-2">
            +{hiddenBadges.length}
          </Badge>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-5 rounded-full p-0 hover:bg-accent"
              >
                <Icon name="lucide/more-horizontal" className="size-4" />
                <span className="sr-only">Xem thêm</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto">
              <Stack size="sm" direction="column" className="max-w-64">
                {hiddenBadges.map((badge) => (
                  <div key={badge.id}>{badge.element}</div>
                ))}
              </Stack>
            </PopoverContent>
          </Popover>
        )
      )}
    </Stack>
  )
} 
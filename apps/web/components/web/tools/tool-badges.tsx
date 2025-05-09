import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import type { ToolMany, ToolManyExtended, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = ComponentProps<typeof Stack> & {
  tool: ToolOne | ToolMany | ToolManyExtended
}

export const ToolBadges = ({ tool, children, className, ...props }: ToolBadgesProps) => {
  const { firstCommitDate, publishedAt, discountCode, discountAmount, pricingType } = tool

  const commitDiff = firstCommitDate ? differenceInDays(new Date(), firstCommitDate) : null
  const publishedDiff = publishedAt ? differenceInDays(new Date(), publishedAt) : null

  const isNew = commitDiff !== null && commitDiff <= 365
  const isFresh = publishedDiff !== null && publishedDiff <= 30 && publishedDiff >= 0
  const isScheduled = publishedAt !== null && publishedAt > new Date()

  // Map pricingType to appropriate colors, badges, and icons
  const getPricingTypeDetails = () => {
    if (!pricingType) return null

    switch (pricingType) {
      case "Free":
        return {
          label: "Free",
          variant: "success" as const,
          tooltip: "Hoàn toàn miễn phí",
        }
      case "Freemium":
        return {
          label: "Freemium",
          variant: "info" as const,
          tooltip: "Bản miễn phí có giới hạn + bản trả phí",
        }
      case "Paid":
        return {
          label: "Paid",
          variant: "primary" as const,
          tooltip: "Chỉ có phiên bản trả phí",
        }
      case "FreeTrial":
        return {
          label: "Free Trial",
          variant: "warning" as const,
          tooltip: "Dùng thử miễn phí, sau đó trả phí",
        }
      case "OpenSource":
        return {
          label: "Open Source",
          variant: "soft" as const,
          tooltip: "Mã nguồn mở và miễn phí",
        }
      case "API":
        return {
          label: "API",
          variant: "outline" as const,
          tooltip: "Cung cấp API, thường tính phí theo sử dụng",
        }
      default:
        return null
    }
  }

  const pricingTypeDetails = getPricingTypeDetails()

  return (
    <Stack
      size="sm"
      wrap={false}
      className={cx("justify-end text-sm empty:hidden", className)}
      {...props}
    >
      {isNew && (
        <Tooltip tooltip="Repo is less than 1 year old">
          <Icon name="lucide/sparkles" className="size-4 text-yellow-500" />
        </Tooltip>
      )}

      {isFresh && (
        <Tooltip tooltip="Published in the last 30 days">
          <Icon name="lucide/bell-plus" className="size-4 text-green-500" />
        </Tooltip>
      )}

      {isScheduled && (
        <Tooltip tooltip={`Scheduled for ${formatDate(publishedAt)}`}>
          <Icon name="lucide/clock" className="size-4 text-yellow-500" />
        </Tooltip>
      )}

      {discountAmount && (
        <Tooltip
          tooltip={
            discountCode
              ? `Use code ${discountCode} for ${discountAmount}!`
              : `Get ${discountAmount} with our link!`
          }
        >
          <Icon name="lucide/square-percent" className="size-4 text-green-500" />
        </Tooltip>
      )}

      {pricingTypeDetails && (
        <Tooltip tooltip={pricingTypeDetails.tooltip}>
          <Badge size="sm" variant={pricingTypeDetails.variant}>
            {pricingTypeDetails.label}
          </Badge>
        </Tooltip>
      )}

      {children}
    </Stack>
  )
}

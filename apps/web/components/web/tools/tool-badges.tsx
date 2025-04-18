import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import type { ComponentProps } from "react"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import type { ToolMany, ToolManyExtended, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"
import { Badge } from "~/components/common/badge"

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

  // Map pricingType to appropriate colors and icons
  const getPricingTypeDetails = () => {
    if (!pricingType) return null
    
    switch (pricingType) {
      case 'Free':
        return { icon: 'lucide/tag', tooltip: 'Free', className: 'text-green-500' }
      case 'Freemium':
        return { icon: 'lucide/tag', tooltip: 'Freemium', className: 'text-blue-500' }
      case 'Paid':
        return { icon: 'lucide/credit-card', tooltip: 'Paid', className: 'text-purple-500' }
      case 'FreeTrial':
        return { icon: 'lucide/clock', tooltip: 'Free Trial', className: 'text-amber-500' }
      case 'OpenSource':
        return { icon: 'lucide/github', tooltip: 'Open Source', className: 'text-orange-500' }
      case 'API':
        return { icon: 'lucide/code', tooltip: 'API', className: 'text-cyan-500' }
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
          <Icon name={pricingTypeDetails.icon} className={cx("size-4", pricingTypeDetails.className)} />
        </Tooltip>
      )}

      {children}
    </Stack>
  )
}

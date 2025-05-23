import { formatNumber } from "@curiousleaf/utils"
import { db } from "@m4v/db"
import { ToolStatus } from "@m4v/db/client"
import { subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import plur from "plur"
import { Badge } from "~/components/common/badge"
import { Link } from "~/components/common/link"
import { Ping } from "~/components/common/ping"

const getCounts = async () => {
  "use cache"

  cacheTag("tools-count")
  cacheLife("minutes")

  return await db.$transaction([
    db.tool.count({
      where: { status: ToolStatus.Published },
    }),

    db.tool.count({
      where: { status: ToolStatus.Published, publishedAt: { gte: subDays(new Date(), 7) } },
    }),
  ])
}

const CountBadge = async () => {
  const [count, newCount] = await getCounts()

  return (
    <Badge prefix={<Ping />} className="order-first" asChild>
      <Link href="/latest">
        {newCount
          ? `${formatNumber(newCount)} công cụ mới được thêm`
          : `${formatNumber(count)}+ công cụ mã nguồn mở`}
      </Link>
    </Badge>
  )
}

const CountBadgeSkeleton = () => {
  return (
    <Badge prefix={<Ping />} className="min-w-20 order-first pointer-events-none animate-pulse">
      &nbsp;
    </Badge>
  )
}

export { CountBadge, CountBadgeSkeleton }

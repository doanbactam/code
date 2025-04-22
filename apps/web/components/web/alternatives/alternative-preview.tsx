import { Link } from "~/components/common/link"
import {
  AlternativeList,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"
import { findAlternatives } from "~/server/web/alternatives/queries"

const AlternativePreview = async () => {
  const list = [
    "monday",
    "notion",
    "airtable",
    "typeform",
    "teamwork",
    "todoist",
    "kissmetrics",
    "fathom-analytics",
  ]

  const alternatives = await findAlternatives({
    where: { slug: { in: list } },
    take: 6,
  })

  if (!alternatives.length) {
    return null
  }

  return (
    <Listing
      title="Khám phá công cụ AI hàng đầu cho:"
      button={<Link href="/alternatives">Xem tất cả công cụ AI</Link>}
      separated
    >
      <AlternativeList alternatives={alternatives} showAd={false} />
    </Listing>
  )
}

const AlternativePreviewSkeleton = () => {
  return (
    <Listing title="Khám phá công cụ AI hàng đầu cho:">
      <AlternativeListSkeleton />
    </Listing>
  )
}

export { AlternativePreview, AlternativePreviewSkeleton }

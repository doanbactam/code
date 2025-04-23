import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ComingSoonToolListing } from "~/app/(web)/coming-soon/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Công cụ AI sắp ra mắt!",
  description: `Dưới đây là danh sách các công cụ AI đang được lên kế hoạch để được đăng tải trên ${config.site.name}. Chúng không được hiển thị ở bất kỳ đâu khác trên trang web.`,
  openGraph: { ...metadataConfig.openGraph, url: "/coming-soon" },
  alternates: { ...metadataConfig.alternates, canonical: "/coming-soon" },
}

export default async function ComingSoonPage(props: PageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/coming-soon",
            name: "Sắp ra mắt",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Xem ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <ComingSoonToolListing searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}

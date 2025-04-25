import type { Metadata } from "next"
import { Suspense } from "react"
import { TopicListing } from "~/app/(web)/topics/letter/[letter]/listing"
import { LetterPicker } from "~/components/web/letter-picker"
import { TopicListSkeleton } from "~/components/web/topics/topic-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  params: Promise<{ letter: string }>
}

const metadata: Metadata = {
  title: "Công cụ AI Topics",
  description: "Khám phá các chủ đề tốt nhất để tìm các tùy chọn công cụ AI tốt nhất.",
}

export const generateStaticParams = async () => {
  return `${config.site.alphabet}&`.split("").map(letter => ({ letter }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { letter } = await params
  const url = `/topics/letter/${letter}`

  return {
    ...metadata,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function Topics(props: PageProps) {
  const params = await props.params
  const letter = decodeURIComponent(params.letter)

  return (
    <>
      <div className="mb-8 md:mb-10 lg:mb-12">
        <Breadcrumbs
          items={[
            {
              href: "/topics",
              name: "Topics",
            },
            {
              href: `/topics/letter/${letter}`,
              name: letter.toUpperCase(),
            },
          ]}
        />
      </div>

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <LetterPicker path="/topics/letter" />

      <Suspense fallback={<TopicListSkeleton />}>
        <TopicListing params={props.params} />
      </Suspense>
    </>
  )
}

import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryListing } from "~/app/(web)/categories/(categories)/listing"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Danh mục công cụ AI",
  description: "Duyệt các danh mục hàng đầu để tìm các lựa chọn công cụ AI tốt nhất.",
  openGraph: { ...metadataConfig.openGraph, url: "/categories" },
  alternates: { ...metadataConfig.alternates, canonical: "/categories" },
}

export default function Categories() {
  return (
    <>
      <div className="mb-8 md:mb-10 lg:mb-12">
        <Breadcrumbs
          items={[
            {
              href: "/categories",
              name: "Danh mục",
            },
          ]}
        />
      </div>

      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListing />
      </Suspense>
    </>
  )
}

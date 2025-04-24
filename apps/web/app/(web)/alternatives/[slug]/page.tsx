import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Fragment, Suspense, cache } from "react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { AlternativeCardExternal } from "~/components/web/alternatives/alternative-card-external"
import {
  AlternativePreview,
  AlternativePreviewSkeleton,
} from "~/components/web/alternatives/alternative-preview"
import { InlineMenu } from "~/components/web/inline-menu"
import { ShareButtons } from "~/components/web/share-buttons"
import { ToolEntry } from "~/components/web/tools/tool-entry"
import { BackButton } from "~/components/web/ui/back-button"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { FaviconImage } from "~/components/web/ui/favicon"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import type { AlternativeOne } from "~/server/web/alternatives/payloads"
import { findAlternative, findAlternativeSlugs } from "~/server/web/alternatives/queries"
import type { CategoryMany } from "~/server/web/categories/payloads"
import { findToolsWithCategories } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

type CategoryCount = Record<
  string,
  {
    count: number
    category: CategoryMany
  }
>

const getAlternative = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const alternative = await findAlternative({ where: { slug } })

  if (!alternative) {
    notFound()
  }

  return alternative
})

const getMetadata = (alternative: AlternativeOne): Metadata => {
  const year = 2025
  const count = alternative._count.tools
  const displayCount = count > 10 ? "10+" : count > 1 ? count : ""

  return {
    title: `${displayCount ? `${displayCount} ` : ""}Giải pháp công cụ AI thay thế ${alternative.name} tốt nhất năm ${year}`,
    description: `Bộ sưu tập các giải pháp công cụ AI thay thế cho ${alternative.name}. Mỗi giải pháp đều có ảnh chụp màn hình kèm theo đánh giá chi tiết về tính năng.`,
  }
}

export const generateStaticParams = async () => {
  const alternatives = await findAlternativeSlugs({})
  return alternatives.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const alternative = await getAlternative(props)
  const url = `/alternatives/${alternative.slug}`

  return {
    ...getMetadata(alternative),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { url, type: "website" },
  }
}

export default async function AlternativePage(props: PageProps) {
  const [alternative, tools] = await Promise.all([
    getAlternative(props),

    findToolsWithCategories({
      where: { alternatives: { some: { slug: (await props.params).slug } } },
      orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
    }),
  ])

  const medalColors = ["text-amber-500", "text-slate-400", "text-orange-700"]
  const { title } = getMetadata(alternative)

  // Sort the categories by count
  const categories = Object.values(
    tools.reduce<CategoryCount>((acc, { categories }) => {
      for (const category of categories) {
        if (!acc[category.name]) {
          acc[category.name] = { count: 0, category }
        }
        acc[category.name].count += 1
      }
      return acc
    }, {}),
  ).sort((a, b) => b.count - a.count)

  // Pick the top 5 tools
  const bestTools = tools.slice(0, 5).map(tool => (
    <Link key={tool.slug} href={`/${tool.slug}`}>
      {tool.name}
    </Link>
  ))

  // Pick the top categories
  const bestCategories = categories.slice(0, 3).map(({ category }) => (
    <Link key={category.slug} href={`/categories/${category.fullPath}`}>
      {category.label || category.name}
    </Link>
  ))

  return (
    <>
      {/* <Breadcrumbs
        items={[
          {
            href: "/alternatives",
            name: "Công cụ thay thế",
          },
          {
            href: `/alternatives/${alternative.slug}`,
            name: alternative.name,
          },
        ]}
      /> */}

      <Intro>
        <IntroTitle>Công cụ AI tốt nhất thay thế {alternative.name}</IntroTitle>

        <IntroDescription className="max-w-4xl">
          {alternative._count.tools
            ? `Bộ sưu tập ${alternative._count.tools} công cụ AI thay thế tốt nhất cho ${alternative.name}.`
            : `Chưa tìm thấy công cụ AI thay thế nào cho ${alternative.name}.`}
        </IntroDescription>
      </Intro>

      {!!tools.length && (
        <Section>
          <Section.Content className="gap-12 md:gap-14 lg:gap-16">
            <Prose>
              <p>
                Công cụ AI thay thế tốt nhất cho {alternative.name} là {bestTools.shift()}. Nếu
                không phù hợp, chúng tôi đã tổng hợp một {" "}
                <Link href="/about#how-are-rankings-calculated">danh sách xếp hạng</Link> các công cụ AI
                thay thế cho {alternative.name} để giúp bạn tìm thấy phương án phù hợp.
                {!!bestTools.length && (
                  <>
                    {" "}
                    Các công cụ AI thay thế
                    {bestTools.length === 1
                      ? ` thú vị khác cho ${alternative.name} là `
                      : ` thú vị khác cho ${alternative.name} bao gồm: `}
                    {bestTools.map((alt, index) => (
                      <Fragment key={index}>
                        {index > 0 && index !== bestTools.length - 1 && ", "}
                        {index > 0 && index === bestTools.length - 1 && " và "}
                        {alt}
                      </Fragment>
                    ))}
                    .
                  </>
                )}
              </p>

              {!!bestCategories.length && (
                <p>
                  Các giải pháp thay thế cho {alternative.name} chủ yếu thuộc {bestCategories.shift()}
                  {!!bestCategories.length && " nhưng cũng có thể thuộc "}
                  {bestCategories.map((category, index) => (
                    <Fragment key={index}>
                      {index > 0 && index !== bestCategories.length - 1 && ", "}
                      {index > 0 && index === bestCategories.length - 1 && " hoặc "}
                      {category}
                    </Fragment>
                  ))}
                  . Duyệt qua các danh mục này nếu bạn muốn danh sách các giải pháp thay thế cụ thể hơn hoặc
                  đang tìm kiếm một chức năng cụ thể của {alternative.name}.
                </p>
              )}

              <ShareButtons title={`${title}`} className="not-prose" />
            </Prose>

            {tools.map(tool => (
              <ToolEntry key={tool.slug} id={tool.slug} tool={tool} />
            ))}

            <BackButton href="/alternatives" />
          </Section.Content>

          <Section.Sidebar className="order-first md:order-last md:max-h-[calc(100vh-5rem)]">
            <AlternativeCardExternal alternative={alternative} />

            <InlineMenu
              items={tools.map(({ slug, name, faviconUrl }, index) => ({
                id: slug,
                title: name,
                prefix: <FaviconImage src={faviconUrl} title={name} className="size-4" />,
                suffix: index < 3 && <Icon name="lucide/award" className={medalColors[index]} />,
              }))}
              className="flex-1 lg:mx-5 max-md:hidden"
            >
              <Button
                size="md"
                variant="ghost"
                prefix={<Icon name="lucide/smile-plus" />}
                suffix={<Icon name="lucide/arrow-up-right" />}
                className="font-normal text-muted-foreground hover:ring-transparent! focus-visible:ring-transparent"
                asChild
              >
                <Link href="/submit">Đề xuất giải pháp thay thế</Link>
              </Button>
            </InlineMenu>
          </Section.Sidebar>
        </Section>
      )}

      <Suspense fallback={<AlternativePreviewSkeleton />}>
        <AlternativePreview />
      </Suspense>
    </>
  )
}

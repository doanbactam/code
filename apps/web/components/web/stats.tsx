import type { ComponentProps } from "react"
import { MDXComponents } from "~/components/web/mdx-components"
import { Stat } from "~/components/web/ui/stat"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Stats = ({ className, ...props }: ComponentProps<"div">) => {
  const stats = [
    { value: config.stats.pageviews, label: "Lượt truy cập" },
    { value: config.stats.tools, label: "Công cụ được liệt kê" },
    { value: config.stats.subscribers, label: "Người đăng ký nhận bản tin" },
    { value: config.stats.stars, label: "Sao GitHub" },
  ]

  return (
    <div
      className={cx("flex flex-wrap items-center justify-around gap-x-4 gap-y-8", className)}
      {...props}
    >
      {stats.map(({ value, label }, index) => (
        <MDXComponents.a
          key={`${index}-${label}`}
          className="flex flex-col items-center gap-1 basis-[12rem] hover:[&[href]]:opacity-80"
        >
          <Stat
            value={value}
            format={{ notation: "compact" }}
            locales="en-US"
            // @ts-expect-error
            style={{ "--number-flow-char-height": "0.75em" }}
            className="text-5xl font-display font-semibold tabular-nums"
          />
          <p className="text-muted-foreground">{label}</p>
        </MDXComponents.a>
      ))}
    </div>
  )
}

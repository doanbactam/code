import { H2 } from "~/components/common/heading"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <H2>404 Không Tìm Thấy</H2>

      <p className="text-muted-foreground text-pretty">
        Chúng tôi rất tiếc, nhưng trang bạn đang tìm kiếm không tồn tại.
      </p>
    </div>
  )
}

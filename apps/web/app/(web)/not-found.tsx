"use client"

import { usePathname } from "next/navigation"
import { Link } from "~/components/common/link"
import { Button } from "~/components/common/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"

export default function NotFound() {
  const pathname = usePathname()

  return (
    <Intro>
      <IntroTitle>404 Không Tìm Thấy</IntroTitle>

      <IntroDescription className="max-w-xl">
        Chúng tôi rất tiếc, nhưng trang {pathname} không thể được tìm thấy. Có thể bạn đã nhập sai địa chỉ
        hoặc trang đã được di chuyển.
      </IntroDescription>

      <Button size="lg" className="mt-4" asChild>
        <Link href="/">Trở về trang chủ</Link>
      </Button>
    </Intro>
  )
}

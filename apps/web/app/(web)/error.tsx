"use client"

import { useEffect } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Intro>
      <IntroTitle>Đã xảy ra lỗi!</IntroTitle>

      <Prose>
        <p>
          Vui lòng thử lại. Nếu sự cố vẫn tiếp tục, hãy liên hệ hỗ trợ tại{" "}
          <Link href={`mailto:${config.site.email}`}>{config.site.email}</Link>.
        </p>
      </Prose>

      <Button className="mt-4" onClick={() => reset()}>
        Thử lại
      </Button>
    </Intro>
  )
}

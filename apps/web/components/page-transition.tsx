"use client"

import { usePathname } from "next/navigation"
import { type PropsWithChildren, useEffect, useState } from "react"
import { cx } from "~/utils/cva"

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(false)

    // Ngắn delay để kích hoạt transition sau khi component mounted
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={cx(
        "transition-all duration-150 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      {children}
    </div>
  )
}

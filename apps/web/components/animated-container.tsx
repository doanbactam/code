"use client"

import { type PropsWithChildren, useEffect, useRef } from "react"
import { cx } from "~/utils/cva"

type AnimationType =
  | "fade-in"
  | "slide-in-up"
  | "slide-in-down"
  | "slide-in-left"
  | "slide-in-right"
  | "zoom-in"
  | "zoom-out"

interface AnimatedContainerProps extends PropsWithChildren {
  animation?: AnimationType
  className?: string
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function AnimatedContainer({
  animation = "fade-in",
  className,
  children,
  delay = 0,
  duration = 300,
  threshold = 0.1,
  once = true,
}: AnimatedContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentRef = ref.current

    if (!currentRef) return

    // Khởi tạo với opacity 0
    currentRef.style.opacity = "0"

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Áp dụng delay nếu có
            setTimeout(() => {
              if (currentRef) {
                // Thêm lớp CSS để kích hoạt animation
                currentRef.style.opacity = "1"
                currentRef.style.animation = `var(--animate-${animation})`
                currentRef.style.animationDuration = `${duration}ms`
              }
            }, delay)

            // Ngừng theo dõi phần tử nếu chỉ muốn chạy animation một lần
            if (once) {
              observer.unobserve(currentRef)
            }
          } else if (!once) {
            // Ẩn phần tử khi không còn trong viewport
            if (currentRef) {
              currentRef.style.opacity = "0"
            }
          }
        }
      },
      { threshold },
    )

    observer.observe(currentRef)
    observerRef.current = observer

    return () => {
      if (currentRef && observerRef.current) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [animation, delay, duration, once, threshold])

  return (
    <div
      ref={ref}
      className={cx("will-change-[opacity,transform]", className)}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  )
}

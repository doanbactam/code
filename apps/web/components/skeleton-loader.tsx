"use client"

import { cx } from "~/utils/cva"

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
  variant?: "shimmer" | "pulse"
}

export function Skeleton({
  className,
  width,
  height,
  circle = false,
  variant = "shimmer",
}: SkeletonProps) {
  return (
    <div
      className={cx(
        "bg-muted/40 dark:bg-muted/20 rounded",
        {
          "animate-pulse": variant === "pulse",
          "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
            variant === "shimmer",
          "rounded-full": circle,
        },
        className,
      )}
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : undefined,
      }}
    />
  )
}

interface SkeletonListProps {
  className?: string
  count?: number
  height?: string | number
  variant?: "shimmer" | "pulse"
}

export function SkeletonList({
  className,
  count = 3,
  height = "2rem",
  variant = "shimmer",
}: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className={className} height={height} variant={variant} />
        ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
  imageHeight?: string | number
  contentLines?: number
  variant?: "shimmer" | "pulse"
}

export function SkeletonCard({
  className,
  imageHeight = "12rem",
  contentLines = 3,
  variant = "shimmer",
}: SkeletonCardProps) {
  return (
    <div className={cx("rounded-lg overflow-hidden", className)}>
      <Skeleton height={imageHeight} variant={variant} />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4" height="1.5rem" variant={variant} />
        <div className="space-y-2">
          {Array(contentLines)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                className={i === contentLines - 1 ? "w-2/3" : "w-full"}
                height="1rem"
                variant={variant}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

interface SkeletonButtonProps {
  className?: string
  width?: string | number
  height?: string | number
  variant?: "shimmer" | "pulse"
}

export function SkeletonButton({
  className,
  width = "6rem",
  height = "2.5rem",
  variant = "shimmer",
}: SkeletonButtonProps) {
  return (
    <Skeleton
      className={cx("rounded-md", className)}
      width={width}
      height={height}
      variant={variant}
    />
  )
}

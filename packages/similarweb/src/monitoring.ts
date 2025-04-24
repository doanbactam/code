import type { WebsiteData } from "./types"

export function logError(error: Error, context: Record<string, any>) {
  // Tĩnh lặng khi có lỗi
}

export function trackMetrics(domain: string, data: WebsiteData) {
  // Không theo dõi metrics
}

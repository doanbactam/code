import type { AllowedKeys } from "@specfy/stack-analyser"
import wretch from "wretch"
import { env } from "~/env"

// Định nghĩa RepositoryData đơn giản để duy trì tính tương thích
export type RepositoryData = {
  name: string
  nameWithOwner: string
  description?: string
  url: string
  homepageUrl?: string
  stars: number
  forks: number
  topics: string[]
}

export type AnalyzerAPIResult = {
  stack: AllowedKeys[]
  repository: RepositoryData
}


export type BrandLinkAPIResult = Record<string, Array<Record<string, string> & { url: string }>>

export const brandLinkApi = wretch("https://brandlink.piotr-f64.workers.dev/api")
  .errorType("json")
  .resolve(r => r.json<BrandLinkAPIResult>())

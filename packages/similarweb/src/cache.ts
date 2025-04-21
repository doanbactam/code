import { WebsiteData } from './types'

export class SimilarWebCache {
  private cache: Map<string, { data: WebsiteData; timestamp: number }>
  private readonly TTL: number // Time to live in milliseconds

  constructor(ttlMinutes = 60) {
    this.cache = new Map()
    this.TTL = ttlMinutes * 60 * 1000
  }

  set(domain: string, data: WebsiteData): void {
    this.cache.set(domain, {
      data,
      timestamp: Date.now()
    })
  }

  get(domain: string): WebsiteData | null {
    const cached = this.cache.get(domain)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(domain)
      return null
    }

    return cached.data
  }
}
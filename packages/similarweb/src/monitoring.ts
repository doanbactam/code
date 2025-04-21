import { WebsiteData } from './types';

export class SimilarWebMonitoring {
  static logError(error: Error, context: Record<string, any>) {
    // Log to monitoring service
    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      ...context
    })
  }

  static trackMetrics(domain: string, data: WebsiteData) {
    // Track important metrics
    console.info({
      timestamp: new Date().toISOString(),
      domain,
      monthlyVisits: data.monthlyVisits,
      globalRank: data.globalRank,
      categoryRank: data.categoryRank,
      lastWebUpdate: data.lastWebUpdate,
    })
  }
}
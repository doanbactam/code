import { WebsiteData } from './types';

export class SimilarWebMonitoring {
  static logError(error: Error, context: Record<string, any>) {
    // Tĩnh lặng khi có lỗi
  }

  static trackMetrics(domain: string, data: WebsiteData) {
    // Không theo dõi metrics
  }
}
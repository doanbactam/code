import axios from "axios"
import type { WebsiteData, SimilarWebResponse } from "./types"
import { getDomain, prepareWebsiteData } from "./utils"

export const createSimilarWebClient = (apiKey: string) => {
  const client = axios.create({
    method: "GET",
    baseURL: "https://similarweb-traffic.p.rapidapi.com",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "similarweb-traffic.p.rapidapi.com",
    },
  })

  return {
    async queryWebsite(website: string): Promise<WebsiteData | null> {
      const domain = getDomain(website)

      try {
        const { data } = await client.get("/traffic", {
          params: { domain },
        })

        if (!data) {
          return null
        }

        const response = data as SimilarWebResponse
        const processedData = prepareWebsiteData(response)

        return processedData
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Tĩnh lặng khi gặp lỗi API
        } else {
          // Tĩnh lặng khi gặp lỗi khác
        }
        return null
      }
    },
  }
}
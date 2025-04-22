import { createSimilarWebClient } from "@m4v/similarweb"
import { env } from "~/env"

export const similarWebClient = env.SIMILARWEB_API_KEY 
  ? createSimilarWebClient(env.SIMILARWEB_API_KEY)
  : {
      queryWebsite: async () => null,
    }
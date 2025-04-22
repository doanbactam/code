import { createAnthropic } from "@ai-sdk/anthropic"
import { isTruthy } from "@curiousleaf/utils"
import { db } from "@m4v/db"
import { generateObject } from "ai"
import { z } from "zod"
import { env } from "~/env"
import { getErrorMessage } from "~/lib/handle-error"
import { firecrawlClient } from "~/services/firecrawl"
import { tryCatch } from "~/utils/helpers"
import { kebabCase } from "change-case"

/**
 * The system prompt for the content generator.
 */
const systemPrompt = `
  Bạn là chuyên gia tạo nội dung tiếng Việt về các sản phẩm AI và mã nguồn mở.
  Nhiệm vụ của bạn là tạo ra nội dung chất lượng cao, hấp dẫn để hiển thị trên trang web danh mục công cụ AI.
  
  Hãy viết bằng giọng điệu chính thống, chuyên nghiệp nhưng thân thiện, phù hợp với độc giả Việt Nam quan tâm đến công nghệ.
  
  Tránh sử dụng:
  - Các cụm từ sáo rỗng như "Trao quyền", "Tối ưu hóa", "Nâng tầm"
  - Các thuật ngữ kỹ thuật quá khó hiểu mà không giải thích
  - Cách diễn đạt dịch máy cứng nhắc
  
  Hãy sử dụng:
  - Ngôn ngữ rõ ràng, dễ hiểu với người Việt Nam
  - Tập trung vào lợi ích thực tế mà công cụ mang lại
  - Giải thích thuật ngữ kỹ thuật khi cần thiết
  - Thể hiện giá trị của công cụ đối với người dùng Việt Nam
  
  Khi đề cập đến giá cả, hãy sử dụng thuật ngữ phù hợp: "Miễn phí", "Freemium", "Trả phí", "Mã nguồn mở", v.v.
`

/**
 * The schema for the content generator.
 */
const contentSchema = z.object({
  tagline: z
    .string()
    .describe(
      "Khẩu hiệu ngắn gọn (tối đa 60 ký tự) thể hiện tinh hoa của công cụ. Viết bằng tiếng Việt tự nhiên, không bao gồm tên công cụ.",
    ),
  description: z
    .string()
    .describe(
      "Mô tả súc tích (tối đa 160 ký tự) nêu bật các tính năng và lợi ích chính. Sử dụng tiếng Việt dễ hiểu, không bao gồm tên công cụ.",
    ),
  content: z
    .string()
    .describe(
      "Mô tả chi tiết, hấp dẫn với các lợi ích chính (tối đa 1000 ký tự). Có thể định dạng Markdown, nhưng nên bắt đầu bằng đoạn văn và không sử dụng tiêu đề. Đánh dấu những điểm quan trọng bằng chữ in đậm. Đảm bảo các danh sách sử dụng cú pháp Markdown chính xác. Hãy viết bằng tiếng Việt tự nhiên, chuyên nghiệp.",
    ),
})

/**
 * Scrapes a website and returns the scraped data.
 * @param url The URL of the website to scrape.
 * @returns The scraped data.
 */
const scrapeWebsiteData = async (url: string) => {
  const data = await firecrawlClient.scrapeUrl(url, { formats: ["markdown"] })

  if (!data.success) {
    throw new Error(data.error)
  }

  return data
}

/**
 * Formats topic strings into valid slugs.
 * @param topics Array of topic strings
 * @returns Array of formatted topic slugs
 */
const formatTopicSlugs = (topics: string[]): string[] => {
  return topics.map(topic => kebabCase(topic.trim().toLowerCase())).filter(Boolean)
}

/**
 * Generates content for a tool.
 * @param url The URL of the website to scrape.
 * @params prompt Additional prompt to add to the system prompt.
 * @returns The generated content.
 */
export const generateContent = async (url: string, prompt?: string) => {
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const model = anthropic("claude-3-5-sonnet-latest")
  const scrapedData = await scrapeWebsiteData(url)

  const { data, error } = await tryCatch(
    generateObject({
      model,
      schema: contentSchema,
      system: systemPrompt,
      temperature: 0.3,
      prompt: `
        Provide me details for the following data:
        Title: ${scrapedData.metadata?.title}
        Description: ${scrapedData.metadata?.description}
        Content: ${scrapedData.markdown}
        
        ${prompt}
      `,
    }),
  )

  if (error) {
    throw new Error(getErrorMessage(error))
  }

  return data.object
}

/**
 * Generates content for a tool with relations.
 * @param url The URL of the website to scrape.
 * @params prompt Additional prompt to add to the system prompt.
 * @returns The generated content.
 */
export const generateContentWithRelations = async (url: string, prompt?: string) => {
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const model = anthropic("claude-3-5-sonnet-latest")
  const scrapedData = await scrapeWebsiteData(url)

  const [categories, alternatives] = await Promise.all([
    db.category.findMany(),
    db.alternative.findMany(),
  ])

  const schema = contentSchema.extend({
    categories: z
      .array(z.string())
      .transform(a => a.map(name => categories.find(cat => cat.name === name)).filter(isTruthy))
      .describe(`
        Phân loại sản phẩm AI vào các danh mục phù hợp.
        Hãy gán cho công cụ nhiều danh mục, nhưng không quá 3 danh mục.
        Nếu công cụ không thuộc danh mục nào, hãy trả về mảng trống.
        Đảm bảo chọn những danh mục phù hợp nhất với chức năng chính của công cụ.
      `),
    alternatives: z
      .array(z.string())
      .transform(a => a.map(name => alternatives.find(alt => alt.name === name)).filter(isTruthy))
      .describe(`
        Gán công cụ AI này cho các sản phẩm phần mềm độc quyền tương tự.
        Cố gắng gán công cụ với nhiều phần mềm thay thế để người dùng Việt Nam có nhiều lựa chọn.
        Nếu công cụ không có phần mềm thay thế, hãy trả về mảng trống.
        Ưu tiên các phần mềm thay thế phổ biến ở Việt Nam nếu có.
      `),
    topics: z
      .array(z.string())
      .transform(formatTopicSlugs)
      .describe(`
        Tạo một danh sách từ 3-8 topic tags cho công cụ.
        Các topics nên là những từ khóa ngắn gọn, đặc trưng cho lĩnh vực của công cụ.
        Ví dụ: "AI", "machine-learning", "text-generation", "image-processing".
        Hãy tạo các topic bằng tiếng Anh với chữ thường, không dấu.
        Đảm bảo các topics đại diện cho các khía cạnh khác nhau của công cụ.
        Mỗi topic nên ngắn gọn, tối đa 2-3 từ, tốt nhất là 1 từ.
      `),
  })

  const { data, error } = await tryCatch(
    generateObject({
      model,
      schema,
      system: systemPrompt,
      temperature: 0.3,
      prompt: `
      Hãy tạo nội dung tiếng Việt dựa trên dữ liệu sau:
      Tiêu đề: ${scrapedData.metadata?.title}
      Mô tả: ${scrapedData.metadata?.description}
      Nội dung: ${scrapedData.markdown}
      
      Yêu cầu bổ sung:
      1. Hãy viết nội dung bằng tiếng Việt tự nhiên, chuyên nghiệp
      2. Tập trung vào giá trị cốt lõi và lợi ích thực tế của công cụ
      3. Giải thích ngắn gọn cách công cụ hoạt động và có thể giúp người dùng Việt Nam như thế nào
      4. Nếu công cụ có tính phí, hãy đề cập đến điều này một cách minh bạch
      5. Sử dụng ngôn ngữ thân thiện, dễ hiểu với người Việt
      6. Tạo các topic tags phù hợp để phân loại công cụ, giúp người dùng dễ dàng tìm kiếm
      
      ${prompt}
      
      Danh sách các danh mục để phân loại công cụ:
      ${categories.map(({ name }) => name).join("\n")}
      
      Danh sách các phần mềm thay thế độc quyền để gán cho công cụ:
      ${alternatives.map(({ name, description }) => `${name}: ${description}`).join("\n")}
    `,
    }),
  )

  if (error) {
    throw new Error(getErrorMessage(error))
  }

  return data.object
}

/**
 * Creates or connects topics to a tool.
 * @param topicSlugs Array of topic slugs
 * @returns Array of connect objects for Prisma
 */
export const connectOrCreateTopics = async (topicSlugs: string[]) => {
  return topicSlugs.map(slug => ({
    where: { slug },
    create: { slug },
  }))
}

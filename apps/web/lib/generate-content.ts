import { createAnthropic } from "@ai-sdk/anthropic"
import { isTruthy } from "@curiousleaf/utils"
import { db } from "@m4v/db"
import { PricingType } from "@m4v/db/client"
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
  
  Khi đề cập đến giá cả, hãy phân tích cẩn thận và gán loại giá phù hợp. Dành thời gian đọc kỹ nội dung trang web, đặc biệt là các trang Pricing, Plans, Products hoặc các phần có liên quan đến chi phí sử dụng. Chú ý các từ khóa như:
  - "Free", "Miễn phí", "Open source", "Mã nguồn mở"
  - "Premium", "Pro", "Business", "Enterprise" 
  - "Free trial", "Dùng thử", "Trial period"
  - "Freemium", "Basic plan + paid plans"
  - "Price per API call", "Pay as you go", "Tính phí theo lượt sử dụng"
  
  Phân loại đúng mô hình giá sẽ giúp người dùng có thông tin chính xác về công cụ.
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
      "Mô tả chi tiết, hấp dẫn với các lợi ích chính (tối đa 1000 ký tự). Tuân theo cấu trúc sau: \n1. Bắt đầu bằng đoạn giới thiệu ngắn gọn về công cụ và lợi ích cốt lõi.\n2. Mô tả 2-3 tính năng chính và giá trị chúng mang lại cho người dùng.\n3. Nếu phù hợp, đề cập đến các trường hợp sử dụng phổ biến.\n4. Kết thúc bằng thông tin về mô hình giá và đối tượng phù hợp.\nĐánh dấu những điểm quan trọng bằng chữ in đậm. Hãy viết bằng tiếng Việt tự nhiên, chuyên nghiệp.",
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
 * Creates a specialized prompt for improving pricing detection and content generation
 * @param url URL of the website being analyzed
 * @param context Additional context about the tool (optional)
 * @returns A specialized prompt string
 */
export const createSpecializedPrompt = (url: string, context?: string) => {
  // Extract domain name for quick reference
  const domain = new URL(url).hostname.replace('www.', '')
  
  return `
Hãy phân tích kỹ trang web ${url} (domain: ${domain}) để tạo nội dung và phát hiện chính xác mô hình giá.

Quy trình phân tích giá cả:
1. Tìm và truy cập trang "Pricing", "Plans", hoặc "Get Started" nếu có
2. Phân tích chi tiết khung giá và các gói dịch vụ (Free, Basic, Pro, Enterprise, v.v.)
3. Xác định xem có bản miễn phí không và nó có giới hạn gì
4. Kiểm tra có yêu cầu thanh toán ngay hay có dùng thử miễn phí
5. Xác minh xem đây có phải dự án mã nguồn mở trên GitHub không

${context || ''}

Xác định chính xác mô hình giá theo các tiêu chí sau:
- Free: Hoàn toàn miễn phí không giới hạn hoặc giới hạn rất ít
- Freemium: Có cả phiên bản miễn phí (có giới hạn) và phiên bản trả phí
- Paid: Chỉ có phiên bản trả phí, không có lựa chọn miễn phí
- FreeTrial: Miễn phí trong thời gian giới hạn, sau đó phải trả phí
- OpenSource: Mã nguồn mở, thường miễn phí và có thể tự host
- API: Cung cấp API có tính phí theo lượt gọi hoặc gói dịch vụ

Lưu ý: Nếu công cụ có nhiều mô hình giá, hãy chọn mô hình chính phù hợp nhất với đa số người dùng.
`
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

  // Add specialized prompt if none is provided
  const enhancedPrompt = prompt || createSpecializedPrompt(url)

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
    pricingType: z
      .nativeEnum(PricingType)
      .describe(`
        Phân tích kỹ lưỡng mô hình giá của công cụ và gán loại giá phù hợp nhất từ các loại sau:
        - Free: Hoàn toàn miễn phí, không có phiên bản trả phí hay giới hạn đáng kể
        - Freemium: Cung cấp phiên bản miễn phí có giới hạn và phiên bản trả phí có tính năng nâng cao
        - Paid: Chỉ có phiên bản trả phí, có thể có dùng thử nhưng không có phiên bản miễn phí vĩnh viễn
        - FreeTrial: Miễn phí dùng thử trong một thời gian giới hạn, sau đó phải trả phí
        - OpenSource: Mã nguồn mở, thường miễn phí và có thể tự host
        - API: Cung cấp API có tính phí theo lượt gọi hoặc gói dịch vụ
        
        Quy trình phân tích:
        1. Tìm kiếm các trang như "Pricing", "Plans", "Subscription" trong website
        2. Xem xét các từ khóa liên quan đến giá cả trong toàn bộ nội dung như "Free", "Pro", "Premium", "Enterprise"
        3. Kiểm tra các biểu tượng GitHub hoặc thông tin về repository để xác định mã nguồn mở
        4. Tìm thông tin về dùng thử hoặc thời hạn sử dụng miễn phí
        5. Xác định xem có API riêng với cấu trúc giá khác không
        
        Chú ý: Nếu một công cụ có nhiều mô hình giá (ví dụ: cả bản Freemium và API), hãy chọn mô hình chính phù hợp nhất với đa số người dùng.
      `)
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
      4. Phân tích kỹ càng để xác định mô hình giá (pricingType) chính xác của công cụ
      5. Sử dụng ngôn ngữ thân thiện, dễ hiểu với người Việt
      6. Tạo các topic tags phù hợp để phân loại công cụ, giúp người dùng dễ dàng tìm kiếm
      
      Trước khi trả lời:
      - Dành thời gian đọc kỹ nội dung đã scrape để tìm ra thông tin chi tiết về giá
      - Phân tích mô hình giá để phân loại chính xác (Free, Freemium, Paid, FreeTrial, OpenSource, API)
      - Cấu trúc nội dung theo định dạng đã yêu cầu, tương tự như Futurepedia
      
      ${enhancedPrompt}
      
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

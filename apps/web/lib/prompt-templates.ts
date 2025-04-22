/**
 * Tệp này chứa các mẫu prompt chuyên biệt cho từng trang web cụ thể
 * Sử dụng các mẫu này để cải thiện quá trình tạo nội dung và phát hiện mô hình giá
 */

/**
 * Mẫu prompt đặc biệt cho futurepedia.io
 * @param toolName Tên công cụ
 * @returns Prompt đặc biệt cho futurepedia
 */
export const futurepediaPrompt = (toolName: string) => `
Trang futurepedia.io chứa thông tin chi tiết về công cụ AI "${toolName}".

Cách phân tích trang Futurepedia:
1. Xem xét cẩn thận phần "Pricing" hoặc huy hiệu "Free", "Paid", v.v. ở góc phải của card
2. Xem xét các thông tin về mã nguồn mở (GitHub links, open-source mentions)
3. Tìm "Verified" badges cho các công cụ đã được xác minh
4. Tìm các đặc điểm như "Lifetime Deal" hoặc "Free Trial"

Hãy tạo nội dung theo cấu trúc của Futurepedia:
- Tagline ngắn gọn, súc tích thể hiện giá trị cốt lõi
- Mô tả chi tiết đầy đủ thông tin về cách hoạt động
- Mô tả chi tiết các tính năng nổi bật
- Đề cập rõ ràng về mô hình giá
- Các tags/topics liên quan

Phân loại chính xác mô hình giá theo cách Futurepedia sử dụng:
- Free: Có huy hiệu "Free" hoặc không đề cập đến phí
- Freemium: Có bản miễn phí với giới hạn và bản trả phí nâng cao
- Paid: Chỉ có bản trả phí
- FreeTrial: Dùng thử miễn phí sau đó phải trả phí
- OpenSource: Có link GitHub hoặc đề cập "open source"
- API: Cung cấp API tính phí theo lượt gọi
`

/**
 * Mẫu prompt đặc biệt cho chatgpt.com/plugins hoặc OpenAI GPT Store
 * @param toolName Tên công cụ
 * @returns Prompt đặc biệt cho OpenAI GPT Store
 */
export const gptStorePrompt = (toolName: string) => `
Trang web này là một GPT từ GPT Store của OpenAI về "${toolName}".

Cách phân tích trang GPT Store:
1. Xem mô tả và tính năng chính
2. Xác định xem đây là GPT miễn phí hay trả phí (cần ChatGPT Plus)
3. Tìm thông tin về tác giả/công ty phát triển

Hãy tạo nội dung theo cấu trúc tương tự GPT Store:
- Tagline ngắn gọn, hấp dẫn
- Mô tả chi tiết về khả năng và mục đích của GPT
- Các trường hợp sử dụng phổ biến
- Yêu cầu đăng ký/trả phí nếu cần

Phân loại mô hình giá:
- Free: Có thể sử dụng mà không cần đăng ký ChatGPT Plus
- Paid: Yêu cầu ChatGPT Plus để sử dụng
` 
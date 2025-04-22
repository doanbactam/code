# Quy trình làm việc AI tự động cho m4v

Thư mục này chứa các tệp cấu hình cho hệ thống quy trình làm việc AI tự động cho Cursor IDE, dựa trên dự án [kleosr/cursorkleosr](https://github.com/kleosr/cursorkleosr).

## Đây là gì?

Đây là cách đơn giản hóa để làm việc với trợ lý AI (như Claude hoặc GPT-4) trong Cursor IDE, giúp quá trình phát triển tự động và nhất quán hơn. Nó giúp AI ghi nhớ ngữ cảnh dự án và tuân theo quy trình có cấu trúc, ngay cả khi làm việc qua nhiều phiên khác nhau. Hãy xem nó như việc cung cấp cho trợ lý AI của bạn một bộ nhớ đáng tin cậy và một kế hoạch rõ ràng.

## Các tệp trong thư mục này

1. **`project_config.md` (Bộ nhớ dài hạn - LTM):**
   * Chứa thông tin ổn định, thiết yếu về dự án m4v.
   * Bao gồm mục tiêu dự án, công nghệ chính, các mẫu lập trình quan trọng và các ràng buộc chính.
   * Được cập nhật không thường xuyên.

2. **`workflow_state.md` (Bộ nhớ ngắn hạn + Quy tắc + Nhật ký - STM):**
   * Trái tim năng động của hệ thống. Theo dõi phiên làm việc hiện tại.
   * Chứa giai đoạn hiện tại, trạng thái, kế hoạch, quy tắc và nhật ký các hành động.
   * Được cập nhật thường xuyên trong quá trình hoạt động của AI.

3. **`Instructions.md` (Hướng dẫn):**
   * Cung cấp hướng dẫn chi tiết về cách sử dụng hệ thống quy trình làm việc tự động này.
   * Giải thích các khái niệm cốt lõi, cấu trúc tệp và các mẫu sử dụng.

## Cách sử dụng

1. Đọc tệp `Instructions.md` để biết hướng dẫn sử dụng chi tiết.
2. Khi bắt đầu một phiên Cursor chat mới, hướng dẫn AI hoạt động dựa trên các tệp này.
3. Sử dụng các lệnh như `@blueprint`, `@construct` và `@validate` để hướng dẫn AI qua các giai đoạn quy trình làm việc.

## Lợi ích

* **Tính nhất quán:** AI tuân theo quy trình có cấu trúc cho mỗi nhiệm vụ.
* **Bộ nhớ:** Hệ thống duy trì ngữ cảnh qua các phiên làm việc.
* **Tính tự chủ:** AI có thể làm việc độc lập hơn với các quy tắc rõ ràng và xử lý lỗi.
* **Tính minh bạch:** Phần nhật ký cung cấp khả năng hiển thị các hành động và lý luận của AI.

Để biết thêm chi tiết, xem [dự án gốc trên GitHub](https://github.com/kleosr/cursorkleosr).

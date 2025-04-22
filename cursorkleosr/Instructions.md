# Hướng dẫn: Quy trình làm việc AI tự động cho Cursor

## Tổng quan

Chào mừng đến với quy trình làm việc AI tự động cho dự án m4v! Hệ thống này giúp trợ lý AI của bạn làm việc hiệu quả và nhất quán hơn bằng cách cung cấp cho nó một quy trình có cấu trúc và bộ nhớ đáng tin cậy. Nó chỉ sử dụng hai tệp cốt lõi để quản lý mọi thứ.

## Cách hoạt động: Ý tưởng cốt lõi

AI hoạt động trong một vòng lặp:

1. Nó đọc tình hình hiện tại và các quy tắc từ `workflow_state.md`.
2. Nó quyết định việc cần làm tiếp theo dựa trên các quy tắc đó và kế hoạch nhiệm vụ.
3. Nó sử dụng các tính năng của Cursor (như chỉnh sửa mã hoặc chạy lệnh trong terminal) để thực hiện hành động.
4. Nó ghi lại những gì đã xảy ra vào `workflow_state.md`.
5. Nó lặp lại chu kỳ.

Điều này cho phép AI xử lý các nhiệm vụ một cách tự động, ghi nhớ ngữ cảnh qua các phiên làm việc, và thậm chí cố gắng sửa lỗi dựa trên các quy tắc đã định nghĩa.

## Hai tệp chính

1. **`project_config.md` (Bộ nhớ dài hạn):**
   * Chứa các thông tin cơ bản ổn định của dự án m4v: mục tiêu chính, công nghệ sử dụng, các quy tắc lập trình quan trọng và các giới hạn.
   * Hãy xem nó như "hiến pháp" của dự án. AI đọc nó để hiểu bức tranh tổng thể. Bạn thiết lập nó một lần và hiếm khi cập nhật.

2. **`workflow_state.md` (Trạng thái động, Quy tắc & Nhật ký):**
   * Đây là tệp không gian làm việc chính của AI. Nó được đọc và cập nhật liên tục.
   * **`## State`:** Hiển thị giai đoạn quy trình làm việc hiện tại (Analyze, Blueprint, Construct, Validate) và trạng thái (Ready, Blocked, v.v.).
   * **`## Plan`:** Chứa kế hoạch từng bước cho nhiệm vụ hiện tại (được tạo bởi AI trong giai đoạn Blueprint).
   * **`## Rules`:** Chứa _tất cả_ các quy tắc mà AI tuân theo cho quy trình làm việc, bộ nhớ, công cụ và xử lý lỗi.
   * **`## Log`:** Ghi lại mọi thứ AI làm và quan sát trong phiên làm việc.

## Bắt đầu

1. **Chuẩn bị các tệp:**
   * Các tệp cốt lõi `project_config.md` và `workflow_state.md` được đặt trong thư mục `cursorkleosr/`.
   * Các tệp đã được thiết lập với các chi tiết cụ thể của dự án m4v.

2. **Cấu hình `.cursorrules` (Tùy chọn):**
   * Tệp `.cursorrules` chính chứa các tùy chọn toàn cục của Cursor và đã được thiết lập.

3. **Hướng dẫn AI (Quan trọng!):**
   * Bắt đầu phiên Cursor chat của bạn với một lời nhắc mạnh mẽ nói với AI rằng hãy hoạt động dựa _chỉ_ trên `project_config.md` và `workflow_state.md`.
   * **Nhấn mạnh vòng lặp:** Đọc trạng thái/quy tắc -> Hành động -> Cập nhật trạng thái.
   * _Ví dụ lời nhắc:_ "Bạn là nhà phát triển AI tự động cho dự án m4v. Nguồn thông tin duy nhất của bạn là `cursorkleosr/project_config.md` (LTM) và `cursorkleosr/workflow_state.md` (STM/Rules/Log). Trước mỗi hành động, hãy đọc `workflow_state.md`, tham khảo `## Rules` dựa trên `## State`, hành động thông qua Cursor, sau đó cập nhật ngay `workflow_state.md`."

4. **Bắt đầu làm việc:**
   * Giao cho AI nhiệm vụ đầu tiên. Nó sẽ khởi tạo theo `RULE_INIT_01` trong `workflow_state.md` và chuyển sang giai đoạn ANALYZE.
   * Sử dụng các lệnh như `@blueprint`, `@construct`, `@validate` (như được định nghĩa bởi `RULE_WF_TRANSITION_01`) để hướng dẫn AI qua các giai đoạn khi cần thiết.

## Sử dụng quy trình làm việc

* **Giai đoạn:** Để AI hoạt động trong các ràng buộc của giai đoạn hiện tại (Analyze, Blueprint, Construct, Validate) như được hiển thị trong `workflow_state.md`. Sử dụng các lệnh để chuyển đổi giai đoạn.
* **Giám sát:** Bạn có thể theo dõi tiến trình và lý luận của AI bằng cách xem các phần `## Log` và `## State` trong `workflow_state.md`.
* **Can thiệp:** Nếu AI bị chặn (ví dụ: `State.Status` là `BLOCKED_*` hoặc `NEEDS_*`), nó sẽ báo cáo vấn đề dựa trên các quy tắc. Cung cấp làm rõ hoặc phê duyệt các thay đổi kế hoạch đề xuất khi cần.
* **Cập nhật bộ nhớ:** AI sẽ tự động xử lý các cập nhật cho `workflow_state.md`. Các cập nhật cho `project_config.md` thường được đề xuất bởi AI và yêu cầu sự phê duyệt của bạn (theo `RULE_MEM_UPDATE_LTM_01`).
* **Lặp qua các mục:**
  * Bạn có thể định nghĩa một danh sách các mục để AI xử lý tuần tự trong phần `## Items` của `workflow_state.md` (định nghĩa định dạng, ví dụ: bảng Markdown).
  * AI sẽ sử dụng `RULE_ITERATE_01` và `RULE_ITERATE_02` để xử lý từng mục.
  * Điều quan trọng là phần `## Log` được xóa giữa các mục (bởi `RULE_ITERATE_01`) để ngăn chặn "trôi" ngữ cảnh và giữ cho AI tập trung vào mục hiện tại.
  * Logic xử lý cụ thể cho mỗi mục được xác định bởi `## Plan` và được thực hiện thông qua `RULE_PROCESS_ITEM_01`.

Hệ thống này hướng tới sự tự chủ đáng kể, nhưng hướng dẫn ban đầu rõ ràng thông qua lời nhắc hệ thống và hướng dẫn thỉnh thoảng khi AI gặp phải các vấn đề phức tạp là chìa khóa để thành công.

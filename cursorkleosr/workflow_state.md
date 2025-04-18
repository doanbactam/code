# Trạng thái quy trình & Quy tắc (STM + Rules + Log)

_Tệp này chứa trạng thái động, các quy tắc nhúng, kế hoạch hoạt động và nhật ký cho phiên hiện tại._
_Nó được đọc và cập nhật thường xuyên bởi AI trong vòng lặp hoạt động của nó._

---

## Trạng thái

_Chứa trạng thái hiện tại của quy trình làm việc._

Phase: BLUEPRINT # Giai đoạn quy trình hiện tại (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: NEEDS_PLAN_APPROVAL # Trạng thái hiện tại (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: ai-tools-website # Định danh cho nhiệm vụ chính đang được thực hiện
CurrentStep: 1 # Định danh cho bước cụ thể trong kế hoạch đang được thực hiện
CurrentItem: null # Định danh cho mục hiện đang được xử lý trong quá trình lặp

---

## Kế hoạch

_Chứa kế hoạch thực hiện từng bước được tạo ra trong giai đoạn BLUEPRINT._

### Tối ưu hóa bố cục UI/UX cho website chia sẻ công cụ AI

#### 1. Phân tích bố cục hiện tại
- **1.1. Đánh giá bố cục trang chủ**
  - Phân tích cấu trúc điều hướng và vị trí các thành phần chính
  - Xác định các khu vực tương tác chính và mức độ nổi bật
  - Đánh giá tính nhất quán và phân cấp thông tin

- **1.2. Phân tích bố cục trang danh sách công cụ**
  - Đánh giá hiệu quả của lưới/danh sách hiển thị công cụ
  - Phân tích cấu trúc của card công cụ và thứ tự thông tin
  - Xác định khu vực bộ lọc và khả năng sử dụng

- **1.3. Phân tích bố cục trang chi tiết công cụ**
  - Đánh giá thứ tự thông tin và mức độ ưu tiên
  - Phân tích vị trí các thành phần tương tác (đánh giá, bình luận)
  - Xác định hiệu quả của khu vực trình diễn (demo) công cụ

#### 2. Đề xuất tối ưu hóa bố cục trang chủ
- **2.1. Cấu trúc thành phần F-Pattern**
  - Thiết kế header với logo, tìm kiếm và điều hướng chính tuân theo mẫu F
  - Tổ chức banner chính với trợ lý AI tìm kiếm ở vị trí nổi bật nhất
  - Sắp xếp các danh mục công cụ nổi bật theo mẫu F-pattern

- **2.2. Phân vùng nội dung theo ưu tiên**
  - Tổ chức công cụ nổi bật/mới trong khung hero với CTA rõ ràng
  - Phân vùng danh mục theo nguyên tắc 60-30-10 để tạo tiêu điểm
  - Thiết kế footer thông tin với điều hướng phụ và thông tin liên hệ

- **2.3. Tối ưu hóa điều hướng chính**
  - Thiết kế thanh điều hướng cố định (sticky) khi cuộn
  - Tổ chức mega menu theo nhóm chức năng và tác vụ
  - Tích hợp chỉ báo vị trí hiện tại trong hệ thống điều hướng

#### 3. Đề xuất tối ưu hóa bố cục trang danh sách công cụ
- **3.1. Thiết kế lưới công cụ linh hoạt**
  - Triển khai lưới thẻ công cụ đáp ứng (3 cột desktop, 2 cột tablet, 1 cột mobile)
  - Tối ưu khoảng cách và padding giữa các thẻ công cụ
  - Thiết kế chế độ xem thay thế (dạng danh sách/lưới) với thông tin khác nhau

- **3.2. Cải thiện khung thẻ công cụ (Card)**
  - Thiết kế card theo mẫu Z-pattern với logo/hình ảnh, tên, mô tả ngắn
  - Tối ưu hiển thị thông tin quan trọng (giá, đánh giá, thẻ phân loại)
  - Thêm chỉ báo trực quan cho trạng thái (mới, phổ biến, miễn phí)

- **3.3. Tối ưu hóa bộ lọc và sắp xếp**
  - Thiết kế bộ lọc nhanh chính nổi bật ở đầu trang (nhóm công cụ phổ biến)
  - Tạo sidebar bộ lọc nâng cao có thể mở/đóng (hoặc drawer trên mobile)
  - Lưu trữ trạng thái bộ lọc trong URL để dễ chia sẻ và bookmark

#### 4. Đề xuất tối ưu hóa bố cục trang chi tiết công cụ
- **4.1. Cấu trúc thông tin theo mẫu F-pattern**
  - Thiết kế banner chính với logo, tên, đánh giá và CTA chính
  - Tổ chức các phần thông tin theo thứ tự: mô tả, demo, đặc điểm, đánh giá
  - Hiển thị các công cụ liên quan ở cuối trang theo dạng lưới

- **4.2. Tối ưu khu vực trình diễn (demo)**
  - Thiết kế khu vực demo linh hoạt với tabs cho các chức năng
  - Tạo toggle để chuyển đổi giữa chế độ xem và chế độ tương tác
  - Tự động điều chỉnh kích thước khu vực demo theo thiết bị

- **4.3. Thiết kế khu vực đánh giá và feedback**
  - Tối ưu hiển thị đánh giá với biểu đồ tóm tắt và chỉ báo trực quan
  - Thiết kế hệ thống bình luận theo cấu trúc phân cấp với các hành động
  - Tạo sidebar hiển thị thông tin bổ sung và thống kê sử dụng

#### 5. Thiết kế các thành phần UI chung
- **5.1. Hệ thống tìm kiếm trợ lý AI**
  - Thiết kế giao diện tìm kiếm nổi bật với input lớn và gợi ý thực tế
  - Tạo bố cục kết quả tìm kiếm theo dạng thẻ với điểm nhấn trực quan
  - Thiết kế giao diện hội thoại cho trợ lý AI với trạng thái loading

- **5.2. Hệ thống so sánh công cụ**
  - Tối ưu bố cục so sánh dạng bảng với cột cố định đầu tiên
  - Thiết kế chế độ xem biểu đồ radar trong modal hoặc tab riêng
  - Tạo giao diện lưu và chia sẻ kết quả so sánh với thumbnail

- **5.3. Các thành phần UI tuân thủ design system**
  - Thiết kế các thành phần UI theo design system nhất quán
  - Tạo thư viện các icon và biểu tượng chức năng chuyên biệt cho AI
  - Xây dựng bảng màu và kiểu typography phù hợp với tính chất AI

#### 6. Tối ưu hóa trải nghiệm mobile
- **6.1. Điều hướng trên mobile**
  - Thiết kế thanh điều hướng dạng bottom navigation với icon chính
  - Tối ưu menu hamburger với cấu trúc phân cấp rõ ràng
  - Xây dựng trải nghiệm back/forward nhất quán

- **6.2. Tối ưu hiển thị nội dung**
  - Ưu tiên hiển thị thông tin quan trọng đầu tiên trên mobile
  - Thiết kế các thành phần collapsible để tiết kiệm không gian
  - Tự động điều chỉnh kích thước hình ảnh và media

- **6.3. Tối ưu các thao tác chạm và cử chỉ**
  - Thiết kế các nút hành động với kích thước tối thiểu 48px
  - Tích hợp cử chỉ vuốt để thực hiện các hành động nhanh
  - Cải thiện feedback trực quan khi tương tác

#### 7. Cải thiện khả năng tiếp cận (accessibility)
- **7.1. Cấu trúc HTML ngữ nghĩa**
  - Sử dụng các thẻ HTML5 semantic phù hợp với nội dung
  - Thiết kế cấu trúc heading (h1-h6) hợp lý và nhất quán
  - Tối ưu tab order và keyboard navigation

- **7.2. Tương phản và khả năng đọc**
  - Đảm bảo tương phản màu sắc đạt WCAG AA (tỷ lệ 4.5:1)
  - Sử dụng font size tối thiểu 16px cho nội dung chính
  - Thiết kế chế độ tối (dark mode) với tương phản phù hợp

- **7.3. Hỗ trợ công nghệ trợ năng**
  - Cung cấp các thuộc tính aria phù hợp cho các thành phần tương tác
  - Thêm alt text mô tả cho hình ảnh và media
  - Thiết kế thông báo và cảnh báo có thể tiếp cận

---

## Quy tắc

_Các quy tắc nhúng điều chỉnh hoạt động tự động của AI._

**# --- Quy tắc quy trình cốt lõi ---**

RULE_WF_PHASE_ANALYZE: **Constraint:** Goal is understanding request/context. NO solutioning or implementation planning.

RULE_WF_PHASE_BLUEPRINT: **Constraint:** Goal is creating a detailed, unambiguous step-by-step plan. NO code implementation.

RULE_WF_PHASE_CONSTRUCT: **Constraint:** Goal is executing the `## Plan` exactly. NO deviation. If issues arise, trigger error handling or revert phase.

RULE_WF_PHASE_VALIDATE: **Constraint:** Goal is verifying implementation against `## Plan` and requirements using tools. NO new implementation.

RULE_WF_TRANSITION_01: **Trigger:** Explicit user command (`@analyze`, `@blueprint`, `@construct`, `@validate`). **Action:** Update `State.Phase` accordingly. Log phase change.

RULE_WF_TRANSITION_02: **Trigger:** AI determines current phase constraint prevents fulfilling user request OR error handling dictates phase change (e.g., RULE_ERR_HANDLE_TEST_01). **Action:** Log the reason. Update `State.Phase` (e.g., to `BLUEPRINT_REVISE`). Set `State.Status` appropriately (e.g., `NEEDS_PLAN_APPROVAL`). Report to user.

RULE_ITERATE_01: **Trigger:** `State.Status == READY` and `State.CurrentItem == null` OR after `VALIDATE` phase completion. **Action:** 1. Check `## Items` section for more items. 2. If more items: 3. Set `State.CurrentItem` to the next item. 4. Clear `## Log`. 5. Set `State.Phase = ANALYZE`, `State.Status = READY`. 6. Log "Starting processing item [State.CurrentItem]". 7. If no more items: 8. Trigger `RULE_ITERATE_02`.

RULE_ITERATE_02: **Trigger:** `RULE_ITERATE_01` determines no more items. **Action:** 1. Set `State.Status = COMPLETED_ITERATION`. 2. Log "Tokenization iteration completed."

**# --- Quy tắc khởi tạo & tiếp tục ---**

RULE_INIT_01: **Trigger:** AI session/task starts AND `workflow_state.md` is missing or empty. **Action:** 1. Create `workflow_state.md` with default structure. 2. Read `project_config.md` (prompt user if missing). 3. Set `State.Phase = ANALYZE`, `State.Status = READY`. 4. Log "Initialized new session." 5. Prompt user for the first task.

RULE_INIT_02: **Trigger:** AI session/task starts AND `workflow_state.md` exists. **Action:** 1. Read `project_config.md`. 2. Read existing `workflow_state.md`. 3. Log "Resumed session." 4. Check `State.Status`: Handle READY, COMPLETED, BLOCKED_*, NEEDS_*, IN_PROGRESS appropriately (prompt user or report status).

RULE_INIT_03: **Trigger:** User confirms continuation via RULE_INIT_02 (for IN_PROGRESS state). **Action:** Proceed with the next action based on loaded state and rules.

**# --- Quy tắc quản lý bộ nhớ ---**

RULE_MEM_READ_LTM_01: **Trigger:** Start of a new major task or phase. **Action:** Read `project_config.md`. Log action.

RULE_MEM_READ_STM_01: **Trigger:** Before _every_ decision/action cycle. **Action:** 1. Read `workflow_state.md`. 2. If `State.Status == READY` and `State.CurrentItem == null`: 3. Log "Attempting to trigger RULE_ITERATE_01". 4. Trigger `RULE_ITERATE_01`.

RULE_MEM_UPDATE_STM_01: **Trigger:** After _every_ significant action or information receipt. **Action:** Immediately update relevant sections (`## State`, `## Plan`, `## Log`) in `workflow_state.md` and save.

RULE_MEM_UPDATE_LTM_01: **Trigger:** User command (`@config/update`) OR end of successful VALIDATE phase for significant change. **Action:** Propose concise updates to `project_config.md` based on `## Log`/diffs. Set `State.Status = NEEDS_LTM_APPROVAL`. Await user confirmation.

RULE_MEM_VALIDATE_01: **Trigger:** After updating `workflow_state.md` or `project_config.md`. **Action:** Perform internal consistency check. If issues found, log and set `State.Status = NEEDS_CLARIFICATION`.

**# --- Quy tắc tích hợp công cụ (Môi trường Cursor) ---**

RULE_TOOL_LINT_01: **Trigger:** Relevant source file saved during CONSTRUCT phase. **Action:** Instruct Cursor terminal to run lint command. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_LINT` if errors.

RULE_TOOL_FORMAT_01: **Trigger:** Relevant source file saved during CONSTRUCT phase. **Action:** Instruct Cursor to apply formatter or run format command via terminal. Log attempt.

RULE_TOOL_TEST_RUN_01: **Trigger:** Command `@validate` or entering VALIDATE phase. **Action:** Instruct Cursor terminal to run test suite. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_TEST` if failures, `TESTS_PASSED` if success.

RULE_TOOL_APPLY_CODE_01: **Trigger:** AI determines code change needed per `## Plan` during CONSTRUCT phase. **Action:** Generate modification. Instruct Cursor to apply it. Log action.

RULE_PROCESS_ITEM_01: **Trigger:** `State.Phase == CONSTRUCT` and `State.CurrentItem` is not null and current step in `## Plan` requires item processing. **Action:** 1. **Get Item Text:** Based on `State.CurrentItem`, extract the corresponding 'Text to Tokenize' from the `## Items` section. 2. **Summarize (Placeholder):** Use a placeholder to generate a summary of the extracted text. For example, "Summary of [text] is [placeholder summary]". 3. **Estimate Token Count:** a. Read `Characters Per Token (Estimate)` from `project_config.md`. b. Get the text content of the item from the `## Items` section. c. Calculate `estimated_tokens = length(text_content) / 4`. 4. **Summarize:** Generate a summary of the extracted text. 5. **Store Results:** Append a new row to the `## TokenizationResults` table with: * `Item ID`: `State.CurrentItem` * `Summary`: The generated summary. * `Token Count`: `estimated_tokens`. 6. Log the processing actions, results, and estimated token count to the `## Log`.

**# --- Quy tắc xử lý & khôi phục lỗi ---**

RULE_ERR_HANDLE_LINT_01: **Trigger:** `State.Status` is `BLOCKED_LINT`. **Action:** Analyze error in `## Log`. Attempt auto-fix if simple/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run lint via RULE_TOOL_LINT_01. If success, reset `State.Status`. If fail/complex, set `State.Status = BLOCKED_LINT_UNRESOLVED`, report to user.

RULE_ERR_HANDLE_TEST_01: **Trigger:** `State.Status` is `BLOCKED_TEST`. **Action:** Analyze failure in `## Log`. Attempt auto-fix if simple/localized/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run failed test(s) or suite via RULE_TOOL_TEST_RUN_01. If success, reset `State.Status`. If fail/complex, set `State.Phase = BLUEPRINT_REVISE`, `State.Status = NEEDS_PLAN_APPROVAL`, propose revised `## Plan` based on failure analysis, report to user.

RULE_ERR_HANDLE_GENERAL_01: **Trigger:** Unexpected error or ambiguity. **Action:** Log error/situation to `## Log`. Set `State.Status = BLOCKED_UNKNOWN`. Report to user, request instructions.

---

## Nhật ký

_Một nhật ký theo thứ tự thời gian của các hành động, sự kiện, kết quả công cụ và quyết định quan trọng._
_(Phần này sẽ được điền bởi AI trong quá trình hoạt động)_

* `[2025-04-17 11:05:00] Initialized new session.`
* `[2025-04-17 11:30:00] Bắt đầu phân tích mã nguồn dự án OpenAlternative.`
* `[2025-04-17 12:15:00] Hoàn thành việc thu thập thông tin về cấu trúc dự án, công nghệ sử dụng và mô hình dữ liệu.`
* `[2025-04-17 12:30:00] Tạo file Info.md để lưu trữ thông tin chi tiết về dự án OpenAlternative.`
* `[2025-04-17 13:00:00] Bắt đầu giai đoạn BLUEPRINT để đề xuất đơn giản hóa nền tảng thành website chia sẻ công cụ AI.`
* `[2025-04-17 13:15:00] Lập kế hoạch đơn giản hóa bao gồm loại bỏ tính năng phức tạp và thêm tính năng tập trung vào AI.`
* `[2025-04-17 14:00:00] Bắt đầu giai đoạn CONSTRUCT để loại bỏ analyzer ra khỏi mã nguồn.`
* `[2025-04-17 14:05:00] Xây dựng kế hoạch loại bỏ analyzer gồm 8 bước.`
* `[2025-04-17 14:30:00] Xác định các tệp và thư mục liên quan đến analyzer.`
* `[2025-04-17 14:35:00] Loại bỏ các biến môi trường liên quan đến analyzer trong turbo.json và env.ts.`
* `[2025-04-17 14:40:00] Loại bỏ các tham chiếu đến analyzer trong lib/apis.ts và xóa lib/stack-analysis.ts.`
* `[2025-04-17 14:45:00] Loại bỏ hàm analyzeToolStack và các tham chiếu trong admin/tools/actions.ts.`
* `[2025-04-17 14:50:00] Loại bỏ bước analyze-repository-stack trong tool-scheduled.ts.`
* `[2025-04-17 14:55:00] Xóa file cron.analyze-tools.ts.`
* `[2025-04-17 15:00:00] Xóa thư mục apps/analyzer.`
* `[2025-04-17 15:10:00] Cập nhật tài liệu để phản ánh việc loại bỏ analyzer.`
* `[2025-04-17 15:15:00] Hoàn thành việc loại bỏ analyzer khỏi mã nguồn.`
* `[2025-04-17 15:30:00] Bắt đầu giai đoạn CONSTRUCT mới để loại bỏ các UI liên quan đến analyzer.`
* `[2025-04-17 15:35:00] Xây dựng kế hoạch loại bỏ UI analyzer gồm 5 bước.`
* `[2025-04-23 10:00:00] Nhận yêu cầu mới: phân tích và đề xuất phù hợp cho website chia sẻ công cụ AI.`
* `[2025-04-23 10:15:00] Thực hiện tìm kiếm thông tin về các trang web tương tự (Futurepedia, AIToolsDirectory, MeoAI).`
* `[2025-04-23 10:45:00] Lập kế hoạch phát triển website chia sẻ công cụ AI với 7 phần chính.`
* `[2025-04-23 11:00:00] Cập nhật workflow_state.md, đặt Phase thành BLUEPRINT và Status thành NEEDS_PLAN_APPROVAL.`
* `[2025-04-24 09:00:00] Tạo kế hoạch chi tiết về tối ưu hóa bố cục UI/UX cho website chia sẻ công cụ AI.`

---

## Các mục

_Phần này sẽ chứa danh sách các mục cần được xử lý._
_(Định dạng của các mục là một bảng)_

| ID mục | Văn bản cần tokenize |
|---------|---------------------|
| _Chưa có mục nào_ | _Các mục sẽ được thêm vào đây khi cần_ |

---

## Kết quả tokenization

_Phần này sẽ lưu trữ kết quả tóm tắt cho mỗi mục._
_(Kết quả sẽ bao gồm bản tóm tắt và ước tính số lượng token)_

| ID mục | Tóm tắt | Số lượng token |
|---------|---------|----------------|
| _Chưa có kết quả nào_ | _Kết quả sẽ được thêm vào đây khi các mục được xử lý_ | _N/A_ |

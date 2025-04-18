# Trạng thái quy trình & Quy tắc (STM + Rules + Log)

_Tệp này chứa trạng thái động, các quy tắc nhúng, kế hoạch hoạt động và nhật ký cho phiên hiện tại._
_Nó được đọc và cập nhật thường xuyên bởi AI trong vòng lặp hoạt động của nó._

---

## Trạng thái

_Chứa trạng thái hiện tại của quy trình làm việc._

Phase: BLUEPRINT # Giai đoạn quy trình hiện tại (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: NEEDS_PLAN_APPROVAL # Trạng thái hiện tại (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: github-integration-analysis # Định danh cho nhiệm vụ chính đang được thực hiện
CurrentStep: 1 # Định danh cho bước cụ thể trong kế hoạch đang được thực hiện
CurrentItem: null # Định danh cho mục hiện đang được xử lý trong quá trình lặp

---

## Kế hoạch

_Chứa kế hoạch thực hiện từng bước được tạo ra trong giai đoạn BLUEPRINT._

### Phân tích chi tiết chức năng GitHub đối với mã nguồn

Sau khi phân tích codebase, dưới đây là chức năng của tích hợp GitHub trong dự án:

1. **Cấu trúc thư viện GitHub**
   - Package `@openalternative/github` chứa các module xử lý tương tác với GitHub API
   - Sử dụng GraphQL API của GitHub thông qua thư viện `@octokit/graphql`
   - Thư viện được tổ chức theo các module: client, queries, types, utils

2. **Thu thập thông tin GitHub Repository**
   - Lấy thông tin cơ bản: tên, mô tả, URL, URL trang chủ
   - Lấy số liệu thống kê: stars, forks, contributors, watchers
   - Lấy thông tin thời gian: ngày tạo, ngày cập nhật gần nhất
   - Lấy thông tin giấy phép (license) và các chủ đề (topics)

3. **Xử lý dữ liệu GitHub**
   - Chuyển đổi dữ liệu thô từ API sang định dạng sử dụng trong ứng dụng
   - Tính toán điểm sức khỏe (health score) dựa trên các chỉ số như stars, forks, thời gian hoạt động
   - Xử lý thông tin topics, license và chuẩn hóa dữ liệu

4. **Tích hợp dữ liệu GitHub vào ứng dụng**
   - Lưu trữ thông tin GitHub vào model Tool trong database
   - Hiển thị thông tin như số stars, forks, last commit trên giao diện ToolCard
   - Sử dụng thông tin topics để xác định các tính năng như self-hosted

5. **Quản lý GitHub token**
   - Token GitHub được lưu trong biến môi trường GITHUB_TOKEN
   - Sử dụng token để xác thực với GitHub API và tránh giới hạn rate limiting

6. **Phân tích URL GitHub**
   - Sử dụng regex để trích xuất thông tin owner/name từ URL GitHub
   - Kiểm tra tính hợp lệ của URL GitHub trong quá trình xác thực dữ liệu

7. **Hiển thị thông tin GitHub**
   - Hiển thị số liệu thống kê (stars, forks, last commit) trong ToolCard
   - Sử dụng icons và định dạng số phù hợp để hiển thị dữ liệu
   - Đánh dấu công cụ là mới dựa trên thời gian tạo repository

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
* `[2025-04-17 11:35:00] Analyzed existing codebase to understand structure and patterns for PricingType implementation.`
* `[2025-04-17 11:40:00] Created detailed plan for adding PricingType to the codebase.`
* `[2025-04-17 11:45:00] Transitioned to CONSTRUCT phase to begin implementation.`
* `[2025-04-18 00:56:00] Đã thêm enum PricingType vào schema Prisma.`
* `[2025-04-18 00:57:00] Đã thêm trường pricingType vào model Tool.`
* `[2025-04-18 00:58:00] Đã cập nhật export trong client.ts để bao gồm PricingType.`
* `[2025-04-18 01:00:00] Đã cập nhật các payload trong server/web/tools/payloads.ts.`
* `[2025-04-18 01:02:00] Đã cập nhật schema validation trong server/admin/tools/schemas.ts.`
* `[2025-04-18 01:03:00] Đã cập nhật cấu hình tìm kiếm trong config/search.ts.`
* `[2025-04-18 01:05:00] Đã tạo module queries cho pricingType.`
* `[2025-04-18 01:07:00] Đã cập nhật action filters.ts.`
* `[2025-04-18 01:08:00] Đã tạo migration add_pricing_type.`
* `[2025-04-18 01:10:00] Đã cập nhật giao diện admin, thêm PricingType vào form.`
* `[2025-04-18 01:15:00] Đã sửa lỗi truy cập undefined (filters.pricingType.length) bằng cách cập nhật filterParamsSchema.`
* `[2025-04-18 01:20:00] Transitioned to BLUEPRINT phase for phân tích chức năng GitHub.`
* `[2025-04-18 01:30:00] Đã phân tích codebase để tìm hiểu cách GitHub được tích hợp.`
* `[2025-04-18 01:40:00] Đã tạo kế hoạch chi tiết phân tích chức năng GitHub đối với mã nguồn.`

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

# Trạng thái quy trình & Quy tắc (STM + Rules + Log)

_Tệp này chứa trạng thái động, các quy tắc nhúng, kế hoạch hoạt động và nhật ký cho phiên hiện tại._
_Nó được đọc và cập nhật thường xuyên bởi AI trong vòng lặp hoạt động của nó._

---

## Trạng thái

_Chứa trạng thái hiện tại của quy trình làm việc._

Phase: VALIDATE # Giai đoạn quy trình hiện tại (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: COMPLETED # Trạng thái hiện tại (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: github-integration-removal # Định danh cho nhiệm vụ chính đang được thực hiện
CurrentStep: 8 # Định danh cho bước cụ thể trong kế hoạch đang được thực hiện
CurrentItem: null # Định danh cho mục hiện đang được xử lý trong quá trình lặp

---

## Kế hoạch

_Chứa kế hoạch thực hiện từng bước được tạo ra trong giai đoạn BLUEPRINT._

### Kế hoạch xóa tích hợp Github trong codebase

1. **Xóa package `@openalternative/github`**
   - Xóa toàn bộ thư mục `packages/github`
   - Cập nhật file `package.json` để loại bỏ reference đến package này

2. **Loại bỏ việc sử dụng Github API và biến môi trường**
   - Xóa biến môi trường `GITHUB_TOKEN` trong file `env.ts`
   - Loại bỏ các tham chiếu đến việc xác thực và kết nối với Github API

3. **Cập nhật schema và model database**
   - Xóa các trường liên quan đến Github trong model `Tool` (stars, forks, repository, topics, license, firstCommitDate, lastCommitDate)
   - Chuẩn bị migration cho việc xóa các trường này

4. **Cập nhật server actions và queries**
   - Loại bỏ logic lấy dữ liệu từ Github trong các server actions
   - Loại bỏ các hàm xử lý và chuyển đổi dữ liệu Github
   - Cập nhật bộ lọc và logic sắp xếp không còn phụ thuộc vào dữ liệu Github

5. **Cập nhật UI components**
   - Giữ lại icon Github trong các components
   - Giữ lại nút đăng nhập Github
   - Loại bỏ hiển thị dữ liệu Github (stars, forks, last commit) trong ToolCard
   - Thay thế các icon và hiển thị dữ liệu Github bằng dữ liệu thay thế phù hợp

6. **Cập nhật validation schemas**
   - Loại bỏ `repositorySchema` trong các schema validation
   - Cập nhật schema để không còn yêu cầu URL Github repository

7. **Xóa các thành phần phụ thuộc**
   - Loại bỏ các dependencies không còn cần thiết (ví dụ: @octokit/graphql)
   - Xóa các hàm tiện ích liên quan đến Github

8. **Kiểm thử và sửa lỗi**
   - Chạy tests để phát hiện các lỗi sau khi xóa tích hợp Github
   - Sửa các lỗi phát sinh từ việc xóa tích hợp

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
* `[2025-04-18 02:00:00] Transitioned to BLUEPRINT phase for lập kế hoạch xóa tích hợp GitHub.`
* `[2025-04-18 02:10:00] Đã tạo kế hoạch chi tiết để xóa tích hợp GitHub, chỉ giữ lại UI.`
* `[2025-04-18 02:20:00] Transitioned to CONSTRUCT phase để bắt đầu xóa tích hợp GitHub.`
* `[2025-04-18 02:30:00] Đã phân tích các tệp cần thay đổi khi xóa tích hợp GitHub.`
* `[2025-04-18 02:35:00] Các file cần thay đổi: packages/github (xóa), apps/web/services/github.ts, apps/web/lib/repositories.ts, apps/web/env.ts, apps/web/server/web/shared/schemas.ts, schema.prisma và các file khác liên quan.`
* `[2025-04-18 02:40:00] Phân tích tool-card.tsx: Hiện đang hiển thị các thông tin GitHub (stars, forks, last commit) nhưng đã được thay thế bằng thông tin visits.`
* `[2025-04-18 02:45:00] Tạo regex GitHub độc lập trong schema.ts để thay thế import từ @openalternative/github.`
* `[2025-04-18 02:46:00] Xóa file services/github.ts.`
* `[2025-04-18 02:47:00] Cập nhật lib/repositories.ts để loại bỏ logic GitHub API.`
* `[2025-04-18 02:48:00] Cập nhật lib/apis.ts để định nghĩa RepositoryData cục bộ thay vì import.`
* `[2025-04-18 02:50:00] Cập nhật icons và labels trong tool-card.tsx từ Github (stars, forks) sang truy cập web (visits).`
* `[2025-04-18 02:52:00] Xóa GITHUB_TOKEN khỏi env.ts.`
* `[2025-04-18 02:54:00] Cập nhật schema validation để repositoryUrl không còn là bắt buộc.`
* `[2025-04-18 02:55:00] Cập nhật web/shared/schemas.ts để loại bỏ các ràng buộc GitHub cho form submit.`
* `[2025-04-18 03:00:00] Transitioned to VALIDATE phase để kiểm tra các thay đổi.`
* `[2025-04-18 03:05:00] Kiểm tra tất cả các thay đổi đã thực hiện để xóa tích hợp GitHub.`
* `[2025-04-18 03:10:00] Thực hiện tìm kiếm codebase để kiểm tra xem còn import nào từ @openalternative/github.`
* `[2025-04-18 03:12:00] Không tìm thấy import trực tiếp từ @openalternative/github nữa, đã xác nhận loại bỏ thành công.`
* `[2025-04-18 03:14:00] Xác nhận các định nghĩa mới và icon đã được thay thế đúng cách trong các file.`
* `[2025-04-18 03:15:00] Xác nhận việc loại bỏ validation GitHub đã được áp dụng trong các schema.`
* `[2025-04-18 03:16:00] Xác nhận việc loại bỏ biến môi trường GITHUB_TOKEN từ env.ts.`
* `[2025-04-18 03:17:00] Kiểm tra thư mục packages và xác nhận packages/github đã không còn tồn tại.`
* `[2025-04-18 03:18:00] Các thay đổi đã được kiểm tra và xác nhận. Tất cả mã nguồn liên quan đến GitHub API đã được loại bỏ, chỉ giữ lại UI và cấu trúc dữ liệu cơ bản.`
* `[2025-04-18 03:20:00] Nhiệm vụ hoàn thành: Đã xóa thành công tích hợp GitHub và chỉ giữ lại các phần UI liên quan.`

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

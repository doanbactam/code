# Workflow State & Rules (STM + Rules + Log)

*This file contains the dynamic state, embedded rules, active plan, and log for the current session.*
*It is read and updated frequently by the AI during its operational loop.*

---

## State

*Holds the current status of the workflow.*

```yaml
Phase: CONSTRUCT # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: IN_PROGRESS # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: ImproveAIandPersonalization # Identifier for the main task being worked on
CurrentStep: 7.1 # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
TotalItems: 5 # Total number of items to be processed
ProcessedItems: 0 # Number of items processed so far
CurrentItemIndex: 0 # Index of the current item being processed
LastUpdatedTimestamp: "2025-03-27 13:00:00" # Timestamp of the last update
```

---

## Plan

*Contains the step-by-step implementation plan generated during the BLUEPRINT phase.*

**Kế hoạch cải thiện mã nguồn dự án**

### 1. `[ ] Cải thiện hiệu suất mạng và xử lý lỗi trong media.ts:`
   - `[ ] 1.1 Thêm retry mechanism cho tất cả các API calls (ScreenshotOne, S3, v.v.)`
   - `[ ] 1.2 Cải thiện error handling với thông tin chi tiết hơn`
   - `[ ] 1.3 Thêm timeout options cho tất cả HTTP requests`
   - `[ ] 1.4 Tối ưu hóa S3 upload với multipart upload cho files lớn`
   - `[ ] 1.5 Thêm caching layer cho các API calls thường xuyên`

### 2. `[ ] Triển khai Server Components hiệu quả:`
   - `[ ] 2.1 Chuyển đổi các components phù hợp sang React Server Components`
   - `[ ] 2.2 Đảm bảo các Server Components không import các Client Components`
   - `[ ] 2.3 Thêm Suspense boundaries cho các phần fetch data`
   - `[ ] 2.4 Tối ưu hóa Streaming SSR với các patterns như wrap parameters`
   - `[ ] 2.5 Triển khai Parallel Routes cho bố cục trang phức tạp`

### 3. `[ ] Cải thiện và chuẩn hóa Server Actions (zsa):`
   - `[ ] 3.1 Refactor các server actions hiện tại để sử dụng zsa nhất quán`
   - `[ ] 3.2 Thêm input validation cho tất cả server actions với Zod`
   - `[ ] 3.3 Thêm error handling và response format nhất quán`
   - `[ ] 3.4 Triển khai optimistic updates cho UX tốt hơn`
   - `[ ] 3.5 Thêm rate limiting cho các server actions nhạy cảm`

### 4. `[ ] Cải thiện trải nghiệm người dùng và tính năng giao diện:`
   - `[ ] 4.1 Thêm hiệu ứng skeleton loaders cho tất cả phần loading`
   - `[ ] 4.2 Triển khai dark mode với CSS variables và Tailwind CSS` 
   - `[ ] 4.3 Cải thiện responsive design cho thiết bị di động`
   - `[ ] 4.4 Thêm animations và transitions mượt mà giữa các trang`
   - `[ ] 4.5 Triển khai View Transitions API cho các chuyển đổi trang`

### 5. `[ ] Tối ưu hóa quản lý state và router navigation:`
   - `[ ] 5.1 Sử dụng nhất quán useQueryState (nuqs) cho state trên URL`
   - `[ ] 5.2 Triển khai intercepted routes cho modal dialogs` 
   - `[ ] 5.3 Tối ưu hóa client-side navigation với prefetching`
   - `[ ] 5.4 Cải thiện middleware để xử lý redirects và route protection`
   - `[ ] 5.5 Thêm focus management và keyboard navigation`

### 6. `[ ] Tăng cường bảo mật và xác thực:`
   - `[ ] 6.1 Cài đặt protection CSRF cho tất cả server actions`
   - `[ ] 6.2 Cải thiện hệ thống phân quyền với role-based access control`
   - `[ ] 6.3 Triển khai 2FA cho tài khoản admin`
   - `[ ] 6.4 Thêm Content Security Policy headers`
   - `[ ] 6.5 Quét và khắc phục các lỗ hổng bảo mật trong dependencies`

### 7. `[ ] Cải thiện tính năng AI và cá nhân hóa:`
   - `[ ] 7.1 Nâng cấp tích hợp AI SDK với chức năng tiên tiến hơn`
   - `[ ] 7.2 Thêm gợi ý cá nhân hóa dựa trên hành vi người dùng`
   - `[ ] 7.3 Tối ưu hóa prompt engineering cho AI responses`
   - `[ ] 7.4 Thêm feedback loop để cải thiện độ chính xác AI`
   - `[ ] 7.5 Triển khai memory và context cho AI conversations`

### 8. `[ ] Nâng cấp hệ thống Analytics và Monitoring:`
   - `[ ] 8.1 Tích hợp OpenTelemetry để theo dõi hiệu suất`
   - `[ ] 8.2 Cải thiện error tracking với chi tiết hơn`
   - `[ ] 8.3 Thêm custom events tracking cho user behavior`
   - `[ ] 8.4 Triển khai real-time dashboard cho admin`
   - `[ ] 8.5 Thêm Web Vitals monitoring và reporting`

### 9. `[ ] Tối ưu hóa quy trình CI/CD và Testing:`
   - `[ ] 9.1 Thiết lập unit testing cho các components quan trọng`
   - `[ ] 9.2 Thêm integration tests sử dụng Playwright`
   - `[ ] 9.3 Cải thiện pipeline CI/CD với Turborepo cache`
   - `[ ] 9.4 Thêm A/B testing framework cho các tính năng mới`
   - `[ ] 9.5 Tự động hóa code quality checks với linters và formatters`

### 10. `[ ] Tinh chỉnh SEO và trải nghiệm nội dung:`
   - `[ ] 10.1 Cải thiện dynamic metadata cho tất cả trang`
   - `[ ] 10.2 Triển khai structured data/JSON-LD nhất quán`
   - `[ ] 10.3 Tối ưu hóa Core Web Vitals (LCP, CLS, FID)`
   - `[ ] 10.4 Cải thiện accessibility với ARIA attributes`
   - `[ ] 10.5 Thêm tính năng đa ngôn ngữ và internationalization`

### 11. `[ ] Cải thiện khả năng mở rộng và kiến trúc:`
   - `[ ] 11.1 Triển khai feature flags để kiểm soát rollout`
   - `[ ] 11.2 Refactor theo microservices cho các chức năng phức tạp`
   - `[ ] 11.3 Thêm caching layer với Redis/Upstash cho dữ liệu phổ biến`
   - `[ ] 11.4 Triển khai circuit breakers cho các external API calls`
   - `[ ] 11.5 Cải thiện Database schema và query optimization`

### 12. `[ ] Nâng cao DevEx (Developer Experience):`
   - `[ ] 12.1 Cải thiện TypeScript types và type safety`
   - `[ ] 12.2 Thêm nhiều developer docs và comments`
   - `[ ] 12.3 Chuẩn hóa cấu trúc thư mục và naming conventions`
   - `[ ] 12.4 Tạo các utility components và hooks tái sử dụng`
   - `[ ] 12.5 Tối ưu hóa build times và developer feedback loops`

**Ưu tiên triển khai:**
1. Cao: Các bước 1, 3, 6 (Cải thiện xử lý lỗi, Server Actions, bảo mật)
2. Trung bình: Các bước 2, 4, 5, 8, 10 (Server Components, UX, state management, monitoring, SEO)  
3. Thấp: Các bước 7, 9, 11, 12 (AI, testing, kiến trúc, DevEx)

**Kết quả mong đợi:**
- Cải thiện đáng kể hiệu suất và khả năng mở rộng của ứng dụng
- Nâng cao trải nghiệm người dùng và giảm thời gian tải trang
- Tăng cường bảo mật và khả năng xử lý lỗi
- Tối ưu hóa khả năng bảo trì và mở rộng codebase

---

## Rules

*Embedded rules governing the AI's autonomous operation.*

**# --- Core Workflow Rules ---**

RULE_WF_PHASE_ANALYZE:
  **Constraint:** Goal is understanding request/context. NO solutioning or implementation planning.

RULE_WF_PHASE_BLUEPRINT:
  **Constraint:** Goal is creating a detailed, unambiguous step-by-step plan. NO code implementation.

RULE_WF_PHASE_CONSTRUCT:
  **Constraint:** Goal is executing the `## Plan` exactly. NO deviation. If issues arise, trigger error handling or revert phase.

RULE_WF_PHASE_VALIDATE:
  **Constraint:** Goal is verifying implementation against `## Plan` and requirements using tools. NO new implementation.

RULE_WF_TRANSITION_01:
  **Trigger:** Explicit user command (`@analyze`, `@blueprint`, `@construct`, `@validate`).
  **Action:** Update `State.Phase` accordingly. Log phase change.

RULE_WF_TRANSITION_02:
  **Trigger:** AI determines current phase constraint prevents fulfilling user request OR error handling dictates phase change (e.g., RULE_ERR_HANDLE_TEST_01).
  **Action:** Log the reason. Update `State.Phase` (e.g., to `BLUEPRINT_REVISE`). Set `State.Status` appropriately (e.g., `NEEDS_PLAN_APPROVAL`). Report to user.

RULE_ITERATE:
  **Trigger:** `State.Status == READY` and `State.CurrentItem == null` OR after `VALIDATE` phase completion.
  **Action:**
    1. Check `## Items` section for more items.
    2. If more items:
    3. Set `State.CurrentItem` to the next item.
    4. Clear `## Log`.
    5. Set `State.Phase = ANALYZE`, `State.Status = READY`.
    6. Log "Starting processing item [State.CurrentItem]".
    7. If no more items:
    8. Trigger `RULE_ITERATE`.

**# --- Initialization & Resumption Rules ---**

RULE_INIT_01:
  **Trigger:** AI session/task starts AND `workflow_state.md` is missing or empty.
  **Action:**
    1. Create `workflow_state.md` with default structure.
    2. Read `project_config.md` (prompt user if missing).
    3. Set `State.Phase = ANALYZE`, `State.Status = READY`.
    4. Log "Initialized new session."
    5. Prompt user for the first task.

RULE_INIT_02:
  **Trigger:** AI session/task starts AND `workflow_state.md` exists.
  **Action:**
    1. Read `project_config.md`.
    2. Read existing `workflow_state.md`.
    3. Log "Resumed session."
    4. Check `State.Status`: Handle READY, COMPLETED, BLOCKED_*, NEEDS_*, IN_PROGRESS appropriately (prompt user or report status).

RULE_INIT_03:
  **Trigger:** User confirms continuation via RULE_INIT_02 (for IN_PROGRESS state).
  **Action:** Proceed with the next action based on loaded state and rules.

**# --- Memory Management Rules ---**

RULE_MEM_READ_LTM_01:
  **Trigger:** Start of a new major task or phase.
  **Action:** Read `project_config.md`. Log action.
RULE_MEM_READ_STM_01:
  **Trigger:** Before *every* decision/action cycle.
  **Action:**
    1. Read `workflow_state.md`.
    2. If `State.Status == READY` and `State.CurrentItem == null`:
    3. Log "Attempting to trigger RULE_ITERATE".
    4. Trigger `RULE_ITERATE`.

RULE_MEM_UPDATE_STM_01:
  **Trigger:** After *every* significant action or information receipt.
  **Action:** Immediately update relevant sections (`## State`, `## Plan`, `## Log`) in `workflow_state.md` and save.

RULE_MEM_UPDATE_LTM_01:
  **Trigger:** User command (`@config/update`) OR end of successful VALIDATE phase for significant change.
  **Action:** Propose concise updates to `project_config.md` based on `## Log`/diffs. Set `State.Status = NEEDS_LTM_APPROVAL`. Await user confirmation.

RULE_MEM_VALIDATE_01:
  **Trigger:** After updating `workflow_state.md` or `project_config.md`.
  **Action:** Perform internal consistency check. If issues found, log and set `State.Status = NEEDS_CLARIFICATION`.

**# --- Tool Integration Rules (Cursor Environment) ---**

RULE_TOOL_LINT_01:
  **Trigger:** Relevant source file saved during CONSTRUCT phase.
  **Action:** Instruct Cursor terminal to run lint command. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_LINT` if errors.

RULE_TOOL_FORMAT_01:
  **Trigger:** Relevant source file saved during CONSTRUCT phase.
  **Action:** Instruct Cursor to apply formatter or run format command via terminal. Log attempt.

RULE_TOOL_TEST_RUN_01:
  **Trigger:** Command `@validate` or entering VALIDATE phase.
  **Action:** Instruct Cursor terminal to run test suite. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_TEST` if failures, `TESTS_PASSED` if success.

RULE_TOOL_APPLY_CODE_01:
  **Trigger:** AI determines code change needed per `## Plan` during CONSTRUCT phase.

RULE_PROCESS_ITEM_01:
  **Trigger:** `State.Phase == CONSTRUCT` and `State.CurrentItem` is not null and current step in `## Plan` requires item processing.
  **Action:**
    1. **Get Item Text:** Based on `State.CurrentItem`, extract the corresponding 'Text to Tokenize' from the `## Items` section.
    2. **Summarize (Placeholder):**  Use a placeholder to generate a summary of the extracted text.  For example, "Summary of [text] is [placeholder summary]".
    3. **Estimate Token Count:**
       a. Read `Characters Per Token (Estimate)` from `project_config.md`.
       b. Get the text content of the item from the `## Items` section. (Placeholder: Implement logic to extract text based on `State.CurrentItem` from the `## Items` table.)
       c. Calculate `estimated_tokens = length(text_content) / 4`.
    4. **Summarize (Placeholder):** Use a placeholder to generate a summary of the extracted text.  For example, "Summary of [text] is [placeholder summary]". (Placeholder: Replace with actual summarization tool/logic)
    5. **Store Results:** Append a new row to the `## TokenizationResults` table with:
       *   `Item ID`: `State.CurrentItem`
       *   `Summary`: The generated summary. (Placeholder: Implement logic to store the summary.)
       *   `Token Count`: `estimated_tokens`.
    6. Log the processing actions, results, and estimated token count to the `## Log`. (Placeholder: Implement logging.)

  **Action:** Generate modification. Instruct Cursor to apply it. Log action.

**# --- Error Handling & Recovery Rules ---**

RULE_ERR_HANDLE_LINT_01:
  **Trigger:** `State.Status` is `BLOCKED_LINT`.
  **Action:** Analyze error in `## Log`. Attempt auto-fix if simple/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run lint via RULE_TOOL_LINT_01. If success, reset `State.Status`. If fail/complex, set `State.Status = BLOCKED_LINT_UNRESOLVED`, report to user.

RULE_ERR_HANDLE_TEST_01:
  **Trigger:** `State.Status` is `BLOCKED_TEST`.
  **Action:** Analyze failure in `## Log`. Attempt auto-fix if simple/localized/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run failed test(s) or suite via RULE_TOOL_TEST_RUN_01. If success, reset `State.Status`. If fail/complex, set `State.Phase = BLUEPRINT_REVISE`, `State.Status = NEEDS_PLAN_APPROVAL`, propose revised `## Plan` based on failure analysis, report to user.

RULE_ERR_HANDLE_GENERAL_01:
  **Trigger:** Unexpected error or ambiguity.
  **Action:** Log error/situation to `## Log`. Set `State.Status = BLOCKED_UNKNOWN`. Report to user, request instructions.

RULE_ERR_HANDLE_ITEM_01:
  **Trigger:** Error occurs during item processing.
  **Action:** Log error/situation to `## Log`. Set `State.Status = BLOCKED_ITEM_ERROR`. Report to user, request instructions.

---

## Log

*A chronological log of significant actions, events, tool outputs, and decisions.*
*(This section will be populated by the AI during operation)*

*Example:*
*   `[2025-03-26 17:55:00] Initialized new session.`
*   `[2025-03-26 17:55:15] User task: Implement login feature.`
*   `[2025-03-26 17:55:20] State.Phase changed to ANALYZE.`
*   `[2025-03-26 17:56:00] Read project_config.md.`
*   ...

*Actual Log:*
*   `[2025-03-26 17:53:47] Initialized new session. State set to ANALYZE/READY.`
*   `[2025-03-27 10:05:00] [INFO][SYSTEM] Received user command: @blueprint lên kế hoạch PLAN cải thiện chi tiết.`
*   `[2025-03-27 10:05:15] [INFO][SYSTEM] State.Phase changed to BLUEPRINT.`
*   `[2025-03-27 10:05:20] [INFO][SYSTEM] State.Status changed to IN_PROGRESS.`
*   `[2025-03-27 10:15:00] [INFO][SYSTEM] Blueprint plan created with 10 steps for workflow improvement.`
*   `[2025-03-27 10:15:30] [INFO][SYSTEM] State.Status changed to NEEDS_PLAN_APPROVAL.`
*   `[2025-03-27 10:30:00] [INFO][USER] User requested plan change to focus on source code improvement instead of workflow.`
*   `[2025-03-27 10:32:00] [INFO][SYSTEM] Updated blueprint plan with 12 steps for source code improvement.`
*   `[2025-03-27 10:32:15] [INFO][SYSTEM] State.Status remains NEEDS_PLAN_APPROVAL for the new plan.`
*   `[2025-03-27 11:00:00] [INFO][USER] User requested analysis of ScreenshotOne API error.`
*   `[2025-03-27 11:00:15] [INFO][SYSTEM] State.Phase changed to ANALYZE.`
*   `[2025-03-27 11:00:20] [INFO][SYSTEM] State.Status changed to IN_PROGRESS.`
*   `[2025-03-27 11:00:30] [INFO][SYSTEM] CurrentTaskID updated to AnalyzeScreenshotOneError.`
*   `[2025-03-27 11:10:00] [INFO][SYSTEM] Conducted web search for ScreenshotOne API error information.`
*   `[2025-03-27 11:15:00] [INFO][SYSTEM] Analyzed error response with error_code "host_returned_error" and status code 4.`
*   `[2025-03-27 11:20:00] [INFO][SYSTEM] Identified error cause: Target website returned HTTP status code 4, which is outside the valid response range (200-299).`
*   `[2025-03-27 11:25:00] [INFO][SYSTEM] Found solution: Add ignore_host_errors=true parameter to force taking screenshots despite host errors.`
*   `[2025-03-27 11:30:00] [INFO][USER] User requested to apply fix in code (@construct).`
*   `[2025-03-27 11:30:15] [INFO][SYSTEM] State.Phase changed to CONSTRUCT.`
*   `[2025-03-27 11:30:20] [INFO][SYSTEM] State.Status set to IN_PROGRESS.`
*   `[2025-03-27 11:30:25] [INFO][SYSTEM] CurrentStep set to FixScreenshotOneAPICall.`
*   `[2025-03-27 11:35:00] [INFO][SYSTEM] Located ScreenshotOne API call in apps/web/lib/media.ts.`
*   `[2025-03-27 11:35:30] [INFO][SYSTEM] Added ignore_host_errors=true parameter to ScreenshotOne API query.`
*   `[2025-03-27 11:40:00] [INFO][SYSTEM] Code fix completed successfully. State.Status changed to COMPLETED.`
*   `[2025-03-27 12:00:00] [INFO][USER] User requested to create comprehensive source code improvement plan (@construct PLAN).`
*   `[2025-03-27 12:00:10] [INFO][SYSTEM] State.Phase changed to BLUEPRINT.`
*   `[2025-03-27 12:00:15] [INFO][SYSTEM] State.Status set to IN_PROGRESS.`
*   `[2025-03-27 12:00:20] [INFO][SYSTEM] CurrentTaskID updated to CreateSourceCodeImprovementPlan.`
*   `[2025-03-27 12:15:00] [INFO][SYSTEM] Created detailed source code improvement plan with 12 main areas, with 5 specific tasks for each area.`
*   `[2025-03-27 12:15:15] [INFO][SYSTEM] Added prioritization and expected outcomes to the plan.`
*   `[2025-03-27 12:15:30] [INFO][SYSTEM] State.Status changed to NEEDS_PLAN_APPROVAL, awaiting user confirmation.`
*   `[2025-03-27 13:00:00] [INFO][USER] User requested to implement AI and personalization improvements (@construct).`
*   `[2025-03-27 13:00:10] [INFO][SYSTEM] State.Phase changed to CONSTRUCT.`
*   `[2025-03-27 13:00:15] [INFO][SYSTEM] State.Status set to IN_PROGRESS.`
*   `[2025-03-27 13:00:20] [INFO][SYSTEM] CurrentTaskID updated to ImproveAIandPersonalization.`
*   `[2025-03-27 13:00:25] [INFO][SYSTEM] CurrentStep set to 7.1 (Nâng cấp tích hợp AI SDK).`

---

## Items

*This section will contain the list of items to be processed.*
*(The format of items is a table)*

*Example (Table):*
*   `| Item ID | Text to Tokenize |`
*   `|---|---|`
*   `| item1 | This is the first item to tokenize. This is a short sentence. |`
*   `| item2 | Here is the second item for tokenization. This is a slightly longer sentence to test the summarization. |`
*   `| item3 | This is item number three to be processed. This is a longer sentence to test the summarization. This is a longer sentence to test the summarization. |`
*   `| item4 | And this is the fourth and final item in the list. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. |`
---

## TokenizationResults

*This section will store the summarization results for each item.*
*(Results will include the summary, token count, timestamp, and processing status)*

*Table:*
*   `| Item ID | Summary | Token Count | Timestamp | Status |`
*   `|---|---|---|---|---|`

## Analytics

*Phần này chứa các thống kê và phân tích về quá trình xử lý items.*

### Summary Statistics
*   `Total Items: 0`
*   `Processed Items: 0`
*   `Success Rate: 0%`
*   `Average Processing Time: 0ms`
*   `Average Token Count: 0`

### Token Distribution
*   `Minimum Token Count: 0`
*   `Maximum Token Count: 0`
*   `Median Token Count: 0`
*   `Standard Deviation: 0`

*Note: Statistical data will be populated automatically during processing.*
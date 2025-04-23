# Workflow State & Rules (STM + Rules + Log)

*This file contains the dynamic state, embedded rules, active plan, and log for the current session.*
*It is read and updated frequently by the AI during its operational loop.*

---

## State

*Holds the current status of the workflow.*

```yaml
Phase: BLUEPRINT # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: NEEDS_PLAN_APPROVAL # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: SummarizeItemsIteratively # Identifier for the main task being worked on
CurrentStep: null # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
TotalItems: 0 # Total number of items to be processed
ProcessedItems: 0 # Number of items processed so far
CurrentItemIndex: 0 # Index of the current item being processed
LastUpdatedTimestamp: "2025-03-27 10:15:00" # Timestamp of the last update
```

---

## Plan

*Contains the step-by-step implementation plan generated during the BLUEPRINT phase.*

**Kế hoạch cải thiện mã nguồn dự án**

1. `[ ] Cải thiện hiệu suất và tối ưu hóa ứng dụng Next.js:`
   - Áp dụng Partial Prerendering cho các route phù hợp (trang chủ, danh mục)
   - Thêm Suspense boundaries cho các phần fetch data để tránh waterfall
   - Tối ưu hóa các bundle JS với code splitting hiệu quả hơn
   - Cài đặt và cấu hình module cache cho Server components

2. `[ ] Nâng cao trải nghiệm người dùng và UI:`
   - Cải thiện loading states với skeleton loaders
   - Thêm hiệu ứng chuyển tiếp (transitions) mượt mà giữa các trang
   - Thêm dark mode sử dụng CSS variables và Tailwind CSS
   - Tối ưu hóa UI trên thiết bị di động với responsive design tốt hơn

3. `[ ] Tăng cường bảo mật và xác thực:`
   - Triển khai CSRF protection cho tất cả server actions
   - Thêm rate limiting cho API endpoints nhạy cảm
   - Cải thiện hệ thống phân quyền với RBAC (Role-based access control)
   - Triển khai 2FA (Two-factor authentication) cho tài khoản admin

4. `[ ] Tối ưu hóa Server Actions (zsa):`
   - Refactor các server actions để sử dụng zsa nhất quán hơn
   - Chuẩn hóa cấu trúc response cho tất cả server actions
   - Thêm logging cho server actions để dễ debug
   - Cải thiện xử lý lỗi với các error boundaries chuyên biệt

5. `[ ] Cải thiện quản lý State và Router Navigation:`
   - Sử dụng useQueryState (nuqs) nhất quán cho state trên URL
   - Triển khai paraller và intercepted routes cho UX tốt hơn
   - Sửa dụng useOptimistic để cập nhật UI nhanh hơn
   - Thêm middleware xử lý redirects và bảo vệ route

6. `[ ] Tối ưu hóa cơ sở dữ liệu và fetch API:`
   - Thêm caching layer cho các truy vấn DB phổ biến
   - Triển khai data prefetching cho các route phổ biến
   - Áp dụng query optimization để giảm load time
   - Tích hợp connection pooling để quản lý kết nối DB hiệu quả

7. `[ ] Cải thiện tính năng AI và Personalization:`
   - Nâng cấp tích hợp AI SDK với chức năng tiên tiến hơn
   - Thêm tính năng gợi ý cá nhân hóa dựa trên hành vi người dùng
   - Tối ưu hóa prompt engineering cho AI responses
   - Thêm feedback loop để cải thiện độ chính xác AI

8. `[ ] Nâng cấp hệ thống Analytics và Monitoring:`
   - Tích hợp OpenTelemetry để theo dõi hiệu suất
   - Cải thiện error tracking với chi tiết chi tiết hơn
   - Thêm custom events tracking cho user behavior
   - Triển khai real-time dashboard cho admin

9. `[ ] Tối ưu hóa quy trình CI/CD và Testing:`
   - Thiết lập unit testing cho các components quan trọng
   - Thêm integration tests sử dụng Playwright
   - Cải thiện pipeline CI/CD với Turborepo cache
   - Thêm A/B testing framework cho các tính năng mới

10. `[ ] Tinh chỉnh SEO và Content Delivery:`
    - Cải thiện dynamic metadata cho tất cả trang
    - Triển khai structured data/JSON-LD nhất quán
    - Tối ưu hóa Core Web Vitals (LCP, CLS, FID)
    - Thêm tự động generation sitemap và robots.txt

11. `[ ] Cải thiện khả năng mở rộng và kiến trúc:`
    - Triển khai feature flags để kiểm soát rollout
    - Refactor theo microservices cho các chức năng phức tạp
    - Thêm caching layer với Redis/Upstash cho dữ liệu phổ biến
    - Triển khai circuit breakers cho các external API calls

12. `[ ] Nâng cao DevEx (Developer Experience):`
    - Cải thiện TypeScript types và type safety
    - Thêm nhiều developer docs và comments
    - Chuẩn hóa cấu trúc thư mục và naming conventions
    - Tạo các utility components và hooks tái sử dụng

Khi hoàn thành, kế hoạch này sẽ giúp cải thiện đáng kể hiệu suất, khả năng mở rộng, bảo mật và trải nghiệm người dùng của toàn bộ ứng dụng.

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
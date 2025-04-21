# Workflow State & Rules (STM + Rules + Log)

*This file contains the dynamic state, embedded rules, active plan, and log for the current session.*
*It is read and updated frequently by the AI during its operational loop.*

---

## State

*Holds the current status of the workflow.*

```yaml
Phase: ANALYZE # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: READY # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: SummarizeItemsIteratively # Identifier for the main task being worked on
CurrentStep: null # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
```

---

## Plan

*Contains the step-by-step implementation plan generated during the BLUEPRINT phase.*

**Task: SummarizeItemsIteratively**
## Plan

**Task: Chuyển đổi từ Radix UI + Tailwind sang shadcn/ui**

* `[ ] Step 1: Thiết lập và cấu hình shadcn/ui`
  * `[ ] Step 1.1: Cài đặt shadcn/ui CLI và dependencies cần thiết`
  * `[ ] Step 1.2: Khởi tạo shadcn/ui trong dự án với cấu hình phù hợp`
  * `[ ] Step 1.3: Cập nhật tailwind.config.mjs để hỗ trợ shadcn/ui`
  * `[ ] Step 1.4: Cập nhật global CSS để tích hợp CSS variables của shadcn/ui`

* `[ ] Step 2: Thêm các core components từ shadcn/ui`
  * `[ ] Step 2.1: Thêm Button component và tùy chỉnh variants`
  * `[ ] Step 2.2: Thêm Card component và các phần liên quan`
  * `[ ] Step 2.3: Thêm các form controls: Input, Select`
  * `[ ] Step 2.4: Thêm các utility components: Badge, Avatar, Tooltip`
  * `[ ] Step 2.5: Thêm Skeleton component cho loading states`
  * `[ ] Step 2.6: Thêm Dialog và Pagination components`

* `[ ] Step 3: Tạo compatibility layer để hỗ trợ API hiện tại`
  * `[ ] Step 3.1: Tạo Button wrapper component để hỗ trợ props như prefix, suffix, isPending`
  * `[ ] Step 3.2: Tạo Card wrapper component để hỗ trợ props như asChild, hover, focus`
  * `[ ] Step 3.3: Tạo Input wrapper component để hỗ trợ size props cũ`
  * `[ ] Step 3.4: Tạo Select wrapper component để tương thích với API cũ`

* `[ ] Step 4: Chuyển đổi một module thử nghiệm`
  * `[ ] Step 4.1: Chọn một trang/module đơn giản để thử nghiệm (ví dụ: about page)`
  * `[ ] Step 4.2: Refactor để sử dụng các shadcn/ui components`
  * `[ ] Step 4.3: Kiểm tra visual và functional compatibility`
  * `[ ] Step 4.4: Điều chỉnh các components và wrappers nếu cần`

* `[ ] Step 5: Chuyển đổi domain components chính`
  * `[ ] Step 5.1: Refactor ToolCard sử dụng shadcn/ui Card`
  * `[ ] Step 5.2: Refactor ToolList sử dụng shadcn/ui components`
  * `[ ] Step 5.3: Refactor ToolFilters sử dụng shadcn/ui Dropdown, Checkbox`
  * `[ ] Step 5.4: Refactor ToolSearch sử dụng shadcn/ui Input và các components liên quan`

* `[ ] Step 6: Chuyển đổi từng trang chính của ứng dụng`
  * `[ ] Step 6.1: Chuyển đổi Homepage`
  * `[ ] Step 6.2: Chuyển đổi Detail pages`
  * `[ ] Step 6.3: Chuyển đổi Search results page`
  * `[ ] Step 6.4: Chuyển đổi các Admin pages (nếu có)`

* `[ ] Step 7: Kiểm thử và tinh chỉnh UI`
  * `[ ] Step 7.1: Thực hiện visual regression testing`
  * `[ ] Step 7.2: Kiểm tra responsive behavior trên nhiều kích thước màn hình`
  * `[ ] Step 7.3: Kiểm tra accessibility (ARIA support, keyboard navigation)`
  * `[ ] Step 7.4: Fix các visual bugs và glitches`

* `[ ] Step 8: Tối ưu hóa và làm sạch codebase`
  * `[ ] Step 8.1: Xóa các component cũ không còn sử dụng`
  * `[ ] Step 8.2: Tối ưu hóa imports để giảm bundle size`
  * `[ ] Step 8.3: Cập nhật tài liệu cho component system mới`
  * `[ ] Step 8.4: Rà soát và cải thiện type definitions`

* `[ ] Step 9: Triển khai và theo dõi`
  * `[ ] Step 9.1: Triển khai lên staging environment`
  * `[ ] Step 9.2: Thực hiện user acceptance testing`
  * `[ ] Step 9.3: Triển khai lên production`
  * `[ ] Step 9.4: Theo dõi metrics và phản hồi người dùng`


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

RULE_ITERATE_01: # Triggered by RULE_MEM_READ_STM_01 when State.Status == READY and State.CurrentItem == null, or after VALIDATE phase completion.
  **Trigger:** `State.Status == READY` and `State.CurrentItem == null` OR after `VALIDATE` phase completion.
  **Action:**
    1. Check `## Items` section for more items.
    2. If more items:
    3. Set `State.CurrentItem` to the next item.
    4. Clear `## Log`.
    5. Set `State.Phase = ANALYZE`, `State.Status = READY`.
    6. Log "Starting processing item [State.CurrentItem]".
    7. If no more items:
    8. Trigger `RULE_ITERATE_02`.

RULE_ITERATE_02:
  **Trigger:** `RULE_ITERATE_01` determines no more items.
  **Action:**
    1. Set `State.Status = COMPLETED_ITERATION`.
    2. Log "Tokenization iteration completed."

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
    3. Log "Attempting to trigger RULE_ITERATE_01".
    4. Trigger `RULE_ITERATE_01`.

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
    5. Log the processing actions, results, and estimated token count to the `## Log`.

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
*(Results will include the summary and estimated token count)*

*Example (Table):*
*   `| Item ID | Summary | Token Count |`
*   `|---|---|---|`

## TokenizationResults

*This section will store the tokenization results for each item.*
*(Results will include token counts and potentially tokenized text)*

*Example (Table):*
*   `| Item ID | Token Count | Tokenized Text (Optional) |`
*   `|---|---|---|`
*   `| item1 | 10 | ... (tokenized text) ... |`
*   `| item2 | 12 | ... (tokenized text) ... |`
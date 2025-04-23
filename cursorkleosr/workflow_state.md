# Workflow State & Rules (STM + Rules + Log)

*This file contains the dynamic state, embedded rules, active plan, and log for the current session.*
*It is read and updated frequently by the AI during its operational loop.*

---

## State

*Holds the current status of the workflow.*

```yaml
# Main workflow control
Phase: CONSTRUCT                # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: IN_PROGRESS             # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: SummarizeItemsIteratively  # Identifier for the main task being worked on
CurrentStep: 6                  # Identifier for the specific step in the plan being executed

# Item processing tracking
CurrentItem: null               # Identifier for the item currently being processed in iteration
TotalItems: 0                   # Total number of items to be processed
ProcessedItems: 0               # Number of items processed so far
CurrentItemIndex: 0             # Index of the current item being processed
ItemProcessingQueue: []         # Queue of items waiting to be processed
FailedItems: []                 # List of items that failed processing
PauseProcessing: false          # Flag to pause processing of items

# Error handling
MaxRetryCount: 3                # Maximum number of retry attempts for a failed item
AbortOnError: false             # Whether to stop processing when an error occurs
AutoRecover: true               # Whether to attempt automatic recovery from errors

# Summarization configuration
SummaryConfig:
  MaxLength: 100                # Maximum length of summary in characters
  CompressionRatio: 0.3         # Target compression ratio (summary length / original length)
  PreserveKeyTerms: true        # Whether to ensure key terms are included in summary
  MinSentences: 1               # Minimum number of sentences in summary
  MaxSentences: 3               # Maximum number of sentences in summary
  Algorithm: "extractive"       # Summarization algorithm to use

# Performance metrics
AverageProcessingTimeMs: 0      # Average time to process an item in milliseconds
MaxProcessingTimeMs: 0          # Maximum time taken to process any item
MinProcessingTimeMs: 0          # Minimum time taken to process any item
AverageTokenCount: 0            # Average token count across all processed items

# System management
LastUpdatedTimestamp: "2025-03-27 11:15:00"  # Timestamp of the last update
BackupFrequency: 10             # Create backup after every N operations
LastBackupTimestamp: null       # When the last backup was created
SystemStartTime: "2025-03-26 17:53:47"  # When the system was started
LogLevel: "INFO"                # Current logging verbosity (ERROR, WARNING, INFO, DEBUG)
```

---

## Plan

*Contains the step-by-step implementation plan generated during the BLUEPRINT phase.*

**Kế hoạch cải thiện Workflow State**

1. `[ ] Cải thiện cấu trúc StateManagement:`
   - Thêm trường `TotalItems` để theo dõi tổng số items cần xử lý
   - Thêm trường `ProcessedItems` để theo dõi số items đã xử lý
   - Thêm trường `CurrentItemIndex` để lưu chỉ số của item hiện tại
   - Thêm trường `LastUpdatedTimestamp` để ghi lại thời điểm cập nhật gần nhất

2. `[ ] Tối ưu hóa quy trình lặp lại (RULE_ITERATE):`
   - Gộp RULE_ITERATE_01 và RULE_ITERATE_02 thành một quy tắc duy nhất RULE_ITERATE
   - Thêm xử lý ngoại lệ cho trường hợp không có items hoặc định dạng không đúng
   - Thêm khả năng tạm dừng/tiếp tục quy trình xử lý
   - Thêm khả năng bỏ qua item hiện tại và chuyển sang item tiếp theo

3. `[ ] Cải thiện RULE_PROCESS_ITEM_01:`
   - Loại bỏ các bước trùng lặp (summarize xuất hiện 2 lần)
   - Thêm cơ chế cache để tránh tính toán lại cho các item đã xử lý
   - Thêm tham số cấu hình để điều chỉnh độ dài của bản tóm tắt
   - Thêm xác thực dữ liệu đầu vào để đảm bảo tính nhất quán

4. `[ ] Thống nhất cấu trúc TokenizationResults:`
   - Xóa phần TokenizationResults thứ hai (trùng lặp)
   - Cập nhật cấu trúc bảng với các cột rõ ràng hơn
   - Thêm cột Timestamp để theo dõi thời gian xử lý mỗi item
   - Thêm cột Status để theo dõi trạng thái xử lý của mỗi item (success/error)

5. `[ ] Thêm các quy tắc xử lý lỗi và phục hồi chi tiết:`
   - Thêm RULE_ERR_HANDLE_ITEM_01 để xử lý lỗi khi xử lý một item cụ thể
   - Thêm cơ chế tự động thử lại cho các item bị lỗi
   - Thêm cơ chế ghi log chi tiết về lỗi phát sinh
   - Thêm khả năng khôi phục từ trạng thái đã lưu

6. `[ ] Cải thiện cơ chế ghi log:`
   - Thêm mức độ nghiêm trọng cho mỗi log entry (INFO, WARNING, ERROR)
   - Thêm phân loại log (SYSTEM, PROCESS, USER)
   - Định dạng log nhất quán hơn với cấu trúc [TIMESTAMP][SEVERITY][CATEGORY] Message
   - Thêm khả năng lọc log theo mức độ nghiêm trọng hoặc phân loại

7. `[ ] Thêm phần Analytics cho quy trình xử lý:`
   - Thêm phần thống kê tóm tắt (số items đã xử lý, thời gian xử lý trung bình, v.v.)
   - Thêm biểu đồ đơn giản hiển thị phân phối kích thước token
   - Thêm khả năng xuất dữ liệu sang định dạng CSV
   - Thêm báo cáo hiệu suất xử lý

8. `[ ] Cập nhật YAML Schema để phản ánh cấu trúc State mới:`
   - Định nghĩa các loại dữ liệu hợp lệ cho mỗi trường
   - Thêm các ràng buộc về giá trị (min, max, pattern)
   - Thêm ví dụ cho mỗi trường
   - Thêm mô tả chi tiết hơn cho mỗi trường

9. `[ ] Tinh chỉnh giao diện người dùng trong file markdown:`
   - Cải thiện định dạng của các bảng sử dụng mã màu
   - Thêm các biểu tượng để cải thiện tính dễ đọc
   - Tổ chức lại nội dung để dễ điều hướng hơn
   - Thêm liên kết giữa các phần để dễ dàng di chuyển

10. `[ ] Triển khai cơ chế sao lưu tự động:`
    - Thêm RULE_BACKUP_01 để tự động tạo bản sao lưu của workflow_state.md
    - Thêm cấu hình tần suất sao lưu
    - Thêm khả năng khôi phục từ bản sao lưu cụ thể
    - Thêm xoay vòng bản sao lưu để tránh tăng kích thước quá mức

Khi hoàn thành, kế hoạch này sẽ giúp cải thiện đáng kể tính mạnh mẽ, hiệu quả và khả năng mở rộng của quy trình xử lý items, đồng thời cung cấp thông tin chi tiết hơn về hiệu suất và trạng thái của hệ thống.

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
  **Trigger:** `State.Status == READY` và `State.CurrentItem == null` HOẶC sau khi hoàn thành pha `VALIDATE` HOẶC gọi trực tiếp từ RULE_MEM_READ_STM_01.
  **Action:**
    1. **Kiểm tra trạng thái hệ thống:**
       - Nếu `State.Status == BLOCKED_*` thì ghi log "Không thể tiếp tục do hệ thống đang bị chặn" và không thực hiện tiếp
       - Nếu `TotalItems == 0` thì ghi log "Không có items nào để xử lý" và đặt `State.Status = COMPLETED_ITERATION`
    
    2. **Lấy item tiếp theo:**
       - Kiểm tra `## Items` để xem còn items nào chưa xử lý không
       - Nếu còn items:
         a. Tăng `CurrentItemIndex` lên 1
         b. Đặt `State.CurrentItem` = item tiếp theo dựa vào `CurrentItemIndex`
         c. Nếu item không hợp lệ, ghi log "Item không hợp lệ", thêm vào `FailedItems`, và gọi lại RULE_ITERATE
       
    3. **Xử lý trường hợp có item:**
       - Xóa log cũ trong phần `## Log` nếu cần
       - Đặt `State.Phase = ANALYZE`, `State.Status = READY`
       - Ghi log "Bắt đầu xử lý item [State.CurrentItem]"
       - Tính toán và cập nhật `ProcessedItems` += 1
       
    4. **Xử lý trường hợp hết items:**
       - Đặt `State.Status = COMPLETED_ITERATION`
       - Đặt `State.CurrentItem = null`
       - Đặt `CurrentItemIndex = 0`
       - Ghi log "Đã hoàn thành xử lý tất cả [TotalItems] items"
       - Cập nhật thống kê trong phần Analytics
       
    5. **Xử lý tạm dừng/tiếp tục:**
       - Nếu có cờ `State.PauseProcessing == true` thì đặt `State.Status = PAUSED` và ghi log "Tạm dừng xử lý theo yêu cầu"
       - Thêm thời gian chờ vào `LastUpdatedTimestamp`
    
    6. **Xử lý sao lưu:**
       - Nếu `ProcessedItems % BackupFrequency == 0` thì kích hoạt RULE_BACKUP_01
       - Cập nhật `LastBackupTimestamp`

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
  **Trigger:** `State.Phase == CONSTRUCT` và `State.CurrentItem` không null và bước hiện tại trong `## Plan` yêu cầu xử lý item.
  **Action:**
    1. **Xác thực đầu vào:**
       - Kiểm tra `State.CurrentItem` có tồn tại trong `## Items` hay không
       - Kiểm tra định dạng và tính hợp lệ của dữ liệu
       - Nếu không hợp lệ, ghi log lỗi, thêm vào `FailedItems`, và kích hoạt RULE_ERR_HANDLE_ITEM_01
    
    2. **Kiểm tra cache:**
       - Kiểm tra xem item này đã được xử lý trước đó chưa
       - Nếu đã có trong `## TokenizationResults`, kiểm tra xem có cần xử lý lại không dựa trên timestamp
       - Nếu không cần xử lý lại, ghi log "Sử dụng kết quả cache cho [CurrentItem]" và chuyển sang item tiếp theo
    
    3. **Lấy văn bản và cấu hình tóm tắt:**
       - Dựa trên `State.CurrentItem`, trích xuất 'Text to Tokenize' từ phần `## Items`
       - Đọc cấu hình tóm tắt từ project_config.md (độ dài tóm tắt, tỉ lệ nén, v.v.)
       - Chuẩn bị tham số tóm tắt dựa trên độ dài văn bản và cấu hình
    
    4. **Tính toán token count và tóm tắt:**
       - Đọc `Characters Per Token (Estimate)` từ `project_config.md`
       - Tính `estimated_tokens = length(text_content) / Characters Per Token (Estimate)`
       - Sử dụng thuật toán tóm tắt để tạo bản tóm tắt dựa vào tham số đã cấu hình
       - Ghi thời gian bắt đầu và kết thúc để tính processing_time
    
    5. **Lưu kết quả và cập nhật thống kê:**
       - Thêm vào bảng `## TokenizationResults`: `Item ID`, `Summary`, `Token Count`, `Timestamp`, `Status`
       - Cập nhật các thống kê hiệu suất: `AverageProcessingTimeMs`, `MaxProcessingTimeMs`, `MinProcessingTimeMs`, `AverageTokenCount`
       - Cập nhật `ProcessedItems` += 1
    
    6. **Ghi log chi tiết:**
       - Ghi log với định dạng [TIMESTAMP][INFO][PROCESS] để ghi lại các thao tác xử lý, kết quả, và số token
       - Nếu có cảnh báo hoặc thông tin đặc biệt, ghi log với mức độ phù hợp (WARNING, ERROR)
    
    7. **Xử lý tiếp theo:**
       - Nếu được cấu hình tự động tiếp tục, kích hoạt RULE_ITERATE để xử lý item tiếp theo
       - Nếu không, đặt `State.Phase = VALIDATE` để kiểm tra kết quả xử lý

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
  **Action:** 
    1. **Ghi log lỗi chi tiết:**
       - Ghi log với mức độ ERROR và thông tin chi tiết về lỗi
       - Ghi lại item gây lỗi và trạng thái hệ thống tại thời điểm xảy ra lỗi
    
    2. **Thử lại xử lý:**
       - Kiểm tra `RetryCount` cho item hiện tại
       - Nếu `RetryCount < MaxRetryCount`, tăng `RetryCount` lên 1 và thử lại xử lý
       - Áp dụng các tham số khác nhau cho lần thử lại (ví dụ: tăng timeout)
    
    3. **Xử lý thất bại:**
       - Nếu `RetryCount >= MaxRetryCount`, thêm item vào `FailedItems`
       - Cập nhật trạng thái item trong TokenizationResults thành "ERROR"
       - Ghi log "Đã vượt quá số lần thử lại tối đa cho [CurrentItem]"
    
    4. **Thông báo cho người dùng:**
       - Nếu `AbortOnError == true`, đặt `State.Status = BLOCKED_ITEM_ERROR` và dừng xử lý
       - Nếu không, tiếp tục xử lý item tiếp theo và ghi log với mức độ WARNING
    
    5. **Phục hồi trạng thái:**
       - Lưu trạng thái hiện tại vào bản sao lưu tự động
       - Nếu `AutoRecover == true`, thử phục hồi từ checkpoint cuối cùng

RULE_ERR_HANDLE_SYSTEM_01:
  **Trigger:** Lỗi hệ thống nghiêm trọng (ví dụ: hết bộ nhớ, lỗi I/O, v.v.).
  **Action:**
    1. **Xử lý khẩn cấp:**
       - Ghi log với mức độ ERROR và thông tin chi tiết về lỗi hệ thống
       - Đặt `State.Status = BLOCKED_SYSTEM_ERROR`
       - Lưu trạng thái hiện tại vào bản sao lưu khẩn cấp
    
    2. **Thông báo:**
       - Thông báo cho người dùng với thông tin chi tiết về lỗi
       - Đề xuất các bước khắc phục cụ thể dựa trên loại lỗi
    
    3. **Tự động phục hồi:**
       - Nếu `AutoRecover == true`, thử khởi động lại quy trình xử lý
       - Khôi phục từ bản sao lưu gần nhất có trạng thái hợp lệ
       - Đặt lại các tham số hệ thống về giá trị mặc định an toàn

RULE_RECOVERY_01:
  **Trigger:** Lệnh phục hồi từ người dùng hoặc tự động kích hoạt bởi RULE_ERR_HANDLE_SYSTEM_01.
  **Action:**
    1. **Đánh giá bản sao lưu:**
       - Liệt kê tất cả các bản sao lưu có sẵn theo thời gian
       - Phân tích trạng thái của mỗi bản sao lưu để đánh giá tính hợp lệ
    
    2. **Lựa chọn bản sao lưu:**
       - Nếu có tham số bản sao lưu cụ thể, sử dụng bản sao lưu đó
       - Nếu không, chọn bản sao lưu gần nhất với trạng thái hợp lệ
    
    3. **Khôi phục trạng thái:**
       - Sao chép dữ liệu từ bản sao lưu đã chọn vào workflow_state.md
       - Cập nhật `LastUpdatedTimestamp` thành thời gian hiện tại
       - Ghi log với mức độ INFO về việc khôi phục thành công
    
    4. **Khởi động lại xử lý:**
       - Đặt `State.Phase = ANALYZE`, `State.Status = READY`
       - Cập nhật `CurrentItem`, `CurrentItemIndex` và các tham số khác từ bản sao lưu
       - Ghi log "Phục hồi thành công từ bản sao lưu [timestamp]"

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
*   `[2025-03-27 10:25:00] [INFO][USER] User approved the blueprint plan.`
*   `[2025-03-27 10:25:15] [INFO][SYSTEM] Received user command: @construct.`
*   `[2025-03-27 10:25:30] [INFO][SYSTEM] State.Phase changed to CONSTRUCT.`
*   `[2025-03-27 10:25:45] [INFO][SYSTEM] State.Status changed to IN_PROGRESS.`
*   `[2025-03-27 10:26:00] [INFO][PROCESS] Starting execution of Step 1: Cải thiện cấu trúc StateManagement.`
*   `[2025-03-27 10:35:00] [INFO][PROCESS] Completed Step 1: Cải thiện cấu trúc StateManagement.`
*   `[2025-03-27 10:35:30] [INFO][PROCESS] Starting execution of Step 2: Tối ưu hóa quy trình lặp lại (RULE_ITERATE).`
*   `[2025-03-27 10:45:00] [INFO][PROCESS] Completed Step 2: Tối ưu hóa quy trình lặp lại (RULE_ITERATE).`
*   `[2025-03-27 10:45:30] [INFO][PROCESS] Starting execution of Step 3: Cải thiện RULE_PROCESS_ITEM_01.`
*   `[2025-03-27 10:55:00] [INFO][PROCESS] Completed Step 3: Cải thiện RULE_PROCESS_ITEM_01.`
*   `[2025-03-27 10:55:30] [INFO][PROCESS] Starting execution of Step 4: Thống nhất cấu trúc TokenizationResults.`
*   `[2025-03-27 11:05:00] [INFO][PROCESS] Completed Step 4: Thống nhất cấu trúc TokenizationResults.`
*   `[2025-03-27 11:05:30] [INFO][PROCESS] Starting execution of Step 5: Thêm các quy tắc xử lý lỗi và phục hồi chi tiết.`
*   `[2025-03-27 11:15:00] [INFO][PROCESS] Completed Step 5: Thêm các quy tắc xử lý lỗi và phục hồi chi tiết.`
*   `[2025-03-27 11:15:30] [INFO][PROCESS] Starting execution of Step 6: Cải thiện cơ chế ghi log.`
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

*Bảng này lưu trữ kết quả xử lý và tóm tắt cho mỗi item.*
*Kết quả bao gồm bản tóm tắt, số lượng token, thời gian xử lý, và trạng thái.*

| Item ID | Summary | Token Count | Processing Time (ms) | Timestamp | Status | Retry Count |
|---------|---------|-------------|----------------------|-----------|--------|-------------|
<!-- Các kết quả sẽ được thêm vào đây trong quá trình xử lý -->

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
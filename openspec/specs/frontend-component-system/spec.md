# frontend-component-system Specification

## Purpose
定義本專案前端元件系統的組成與強制規則，作為每個現有與後續頁面／元件的驗收依據，確保所有畫面與 Figma 設計稿一致且能批量修改。

## Requirements

### Requirement: 匯出報表對話框元件 `fb-export-dialog`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-export-dialog`，實作（`dialog-自訂匯出報表-境內`，變體 `Default`／`佔比指標`／`非1號開始`／`客戶帳號明細 (無彙總計算)`／`非1號開始+客戶帳號明細`／`Loading`）的「自訂匯出報表 / Export Report」對話框，並可被多個報表頁沿用。元件 MUST 以 light DOM、傳統 script 實作，變體與狀態透過 HTML 屬性或開啟時傳入的設定控制。

對話框內容 SHALL 包含：

- Header：標題「自訂匯出報表」與副標「Export Report」、一段說明文字、右上關閉鈕（`fb-close`）。
- 可捲動 Body，依序四個設定區塊：
  1. **報表時間維度**（單選）：選項為 `僅匯出「月份累計」資料` 與 `展開「週明細」資料`，各含一行輔助說明。
  2. **統計比較指標 (可多選)**：選項為 `當月 MTD`、`當年 YTD`、`MoM`、`YoY`、`月化`，以每列三欄的卡片排列。
  3. **客戶明細層級**（單選）：選項為四個層級，各含一行輔助說明，區塊標題下方 MUST NOT 再有整體說明文字：
     - `集團戶彙總`：僅呈現至「集團戶/一般法人」彙總列。
     - `產業類別彙總`：僅呈現至「產業類別（如科技業、製造業、銀行）」彙總列。
     - `客戶群彙總`：呈現至「客戶群（如北辰科技、恆信製造）」彙總列，不展開下方帳號明細。
     - `客戶帳號明細`：展開至客戶名稱、主帳號、業務員。
  4. **彙總計算 (可多選)**：兩個核取方塊，各含一行輔助說明：
     - `包含小計`：依據所選的客戶明細層級，自動計算所有父階層的小計列。
     - `包含總計`：自動計算整份報表的全域總計列。
- Footer：左側 `重置預設值 Reset` 文字鈕；右側 `取消 Cancel`（外框鈕）與 `匯出 Export`（主色鈕）。

元件開啟時的預設選取狀態 MUST 為：報表時間維度＝`僅匯出「月份累計」資料`；統計比較指標＝全部五項勾選；客戶明細層級＝`集團戶彙總`；彙總計算＝`包含小計` 與 `包含總計` 皆勾選。`重置預設值 Reset` MUST 將四個區塊還原為此預設狀態（並保留開啟時傳入的條件旗標效果）。

元件 SHALL 提供開啟／關閉的程式介面。開啟介面 MUST 接受選填設定：時間維度、比較指標清單、客戶明細層級（值域為 `affiliate` | `category` | `household` | `account`）、彙總計算清單（`subtotal` | `total` 之子集），以及條件旗標「佔比模式」與「簡化模式」。使用者確認匯出與取消時 MUST 分別對外派發事件；匯出事件 payload MUST 帶出目前選取的時間維度、已勾選的比較指標清單、客戶明細層級（上述新值域）與已勾選的彙總計算清單。關閉鈕、Esc 與 `取消 Cancel` MUST 皆等同取消並關閉；點擊遮罩 MUST NOT 關閉對話框。

**條件行為：**

- **佔比模式**：`月化` 比較指標 MUST 停用並取消勾選，並顯示提示「佔比全月結算無實質買業務意義」。其餘區塊（含客戶明細層級、彙總計算）維持可用。
- **彙總計算 × 客戶明細層級連動**（不論是否簡化模式皆適用）：
  - 當客戶明細層級為 `客戶帳號明細`（`account`）時，`包含小計` 與 `包含總計` MUST 皆取消勾選並停用；「彙總計算 (可多選)」區塊標題 MUST 維持正常樣式，MUST NOT 整區淡化。
  - 當客戶明細層級由 `account` 切換回其他任一層級時，彙總計算 MUST 還原為預設（`包含小計` 與 `包含總計` 皆勾選）。
  - 當客戶明細層級為 `affiliate`／`category`／`household` 之一時，`包含小計` 與 `包含總計` MUST 皆可自由勾選。
  - 匯出事件 payload 的彙總計算清單：客戶明細層級為 `account` 時 MUST 為空陣列 `[]`。
- **簡化模式（資料日期起始非 1 號）**：
  - 頂部 MUST 顯示警告，文字為：「當前選取的日期區間起始日非 1 號，系統已自動啟用「非整月簡化模式」。匯出檔案將不區分月份與週，亦不提供 MTD/YTD 比較指標，右側僅會呈現單一「選取區間累計數據」欄位。」
  - **報表時間維度** 與 **統計比較指標** 兩個區塊 MUST 整區停用；停用時兩個區塊內所有選項 MUST 皆呈未選取狀態（時間維度兩個單選、比較指標五個複選皆不預設選取）。
  - **客戶明細層級** MUST NOT 因簡化模式而停用，維持預設 `集團戶彙總` 且各層級可正常點選。
  - **彙總計算** MUST NOT 因簡化模式而改變；行為與 1 號情境完全相同，僅依上述「彙總計算 × 客戶明細層級連動」規則。

匯出流程：按「匯出 Export」MUST 進入 Loading 態，成功後關閉對話框並由呼叫頁顯示成功通知；本需求 MUST NOT 實作實際檔案產生／下載，亦不實作匯出失敗態。

尺寸：對話框面板 MUST 為 `寬度 60vw`（含合理 min／max 寬）、`高度 80vh`，並 MUST NOT 設固定的最大高度上限（偏離 Figma 元件註記的 680px，以確保小螢幕仍有足夠可操作範圍）；Body 於內容超出時 MUST 可垂直捲動。

所有色彩、字級、行高、圓角、間距 MUST 以 `var(--…)` token 取用；如 Figma 對應變數尚無 token，MUST 於 `design/tokens.json` 補入後使用，MUST NOT 硬編。

#### Scenario: 從報表頁開啟對話框

- **WHEN** 使用者在境內客戶報表頁點擊「匯出報表 Export」
- **THEN** `fb-export-dialog` 以遮罩覆蓋開啟，四個區塊呈現預設選取狀態（客戶明細層級預設為「集團戶彙總」、彙總計算兩項皆勾選），且畫面與 的 `Default` 變體一致

#### Scenario: 客戶明細層級提供四個層級

- **WHEN** 對話框開啟
- **THEN** 客戶明細層級區塊呈現「集團戶彙總 / 產業類別彙總 / 客戶群彙總 / 客戶帳號明細」四個單選項，各帶對應輔助說明，且區塊標題下方無整體說明文字

#### Scenario: 確認匯出送出選項

- **WHEN** 使用者調整選項後點擊「匯出 Export」
- **THEN** 元件進入 Loading 態後對外派發匯出事件，payload 含目前的時間維度、已勾選比較指標清單、客戶明細層級（值為 `affiliate`／`category`／`household`／`account` 之一）與已勾選的彙總計算清單（`subtotal`／`total` 之子集；客戶明細層級為 `account` 時為 `[]`）

#### Scenario: 選客戶帳號明細停用彙總計算

- **WHEN** 使用者將客戶明細層級切換為「客戶帳號明細」
- **THEN** 「包含小計」與「包含總計」皆取消勾選且不可點選，「彙總計算 (可多選)」區塊標題維持正常（非淡化）樣式，畫面與 一致

#### Scenario: 由客戶帳號明細切回其他層級還原彙總計算

- **WHEN** 客戶明細層級目前為「客戶帳號明細」，使用者改選「集團戶彙總」「產業類別彙總」或「客戶群彙總」
- **THEN** 「包含小計」與「包含總計」恢復可點選並回到皆勾選的預設狀態

#### Scenario: 簡化模式停用時間、指標與明細層級

- **WHEN** 開啟時傳入簡化模式旗標
- **THEN** 頂部顯示指定警告文字，「報表時間維度」與「統計比較指標」兩區整區停用且其中所有選項皆呈未選取；「客戶明細層級」不再因簡化模式停用，維持預設「集團戶彙總」且各層級可正常點選

#### Scenario: 簡化模式下彙總計算僅保留總計

- **WHEN** 對話框處於簡化模式
- **THEN** 彙總計算不因簡化模式停用或改變勾選，行為與 1 號情境完全相同，僅依當前客戶明細層級套用連動規則（明細層級為預設「集團戶彙總」時「包含小計」與「包含總計」皆勾選且可切換）

#### Scenario: 重置在簡化模式下不產生矛盾狀態

- **WHEN** 對話框處於簡化模式，使用者點擊「重置預設值 Reset」
- **THEN** 可操作區塊回到預設（客戶明細層級回「集團戶彙總」、彙總計算兩項皆勾選），且被停用的「報表時間維度」與「統計比較指標」不會出現「已停用卻有選取」的狀態

#### Scenario: 佔比模式僅影響月化

- **WHEN** 開啟時傳入佔比模式旗標
- **THEN** 「月化」比較指標停用並取消勾選、顯示提示文字，客戶明細層級與彙總計算區塊維持完全可用

#### Scenario: 重置預設值

- **WHEN** 使用者更改任意選項後點擊「重置預設值 Reset」
- **THEN** 四個區塊還原為預設狀態（月份累計、五項比較指標全選、客戶明細層級＝集團戶彙總、彙總計算兩項皆選），並保留開啟時傳入的條件旗標效果，對話框不關閉

#### Scenario: 取消關閉

- **WHEN** 使用者點擊關閉鈕、按 Esc 或點「取消 Cancel」
- **THEN** 對話框關閉並派發取消事件，且不觸發匯出

#### Scenario: 點擊遮罩不關閉

- **WHEN** 匯出對話框開啟中，使用者點擊面板外的遮罩區域
- **THEN** 對話框保持開啟，不派發取消或匯出事件

### Requirement: 匯出對話框的條件禁用行為

`fb-export-dialog` SHALL 依開啟時傳入的條件旗標調整可用選項：

- **佔比模式**：當旗標指出目前績效指標為「佔比」時，`月化` 比較指標選項 MUST 呈禁用且不可勾選，並於停留（hover／focus）時顯示提示文字「佔比全月結算無實質買業務意義」。其餘選項照常可用。。
- **簡化模式**：當旗標指出資料日期（起）非當月 1 號時，對話框頂部 MUST 顯示橘色警告訊息說明已進入「非整月簡化模式」；`報表時間維度` 與 `統計比較指標` 兩個區塊 MUST 整區禁用（維持顯示但不可操作），警告文字 MUST 說明匯出檔僅呈現單一「選填區間累計數據」欄。。

未帶任何條件旗標開啟時，所有選項 MUST 可正常操作。

#### Scenario: 績效指標為佔比

- **WHEN** 報表頁績效指標選為「佔比」並開啟匯出對話框
- **THEN** `月化` 選項禁用不可勾選，hover 顯示「佔比全月結算無實質買業務意義」，其餘選項可用

#### Scenario: 資料日期起非 1 號

- **WHEN** 報表頁資料日期（起）為某月非 1 號並開啟匯出對話框
- **THEN** 頂部顯示橘色「非整月簡化模式」警告，`報表時間維度` 與 `統計比較指標` 兩區整區禁用

#### Scenario: 一般情況

- **WHEN** 績效指標非佔比且資料日期（起）為 1 號時開啟對話框
- **THEN** 三個區塊所有選項皆可正常操作，無警告訊息

### Requirement: 匯出對話框顯示檔案密碼加密說明

`fb-export-dialog` 的 Header 說明文字 SHALL 為固定的資安密碼加密說明，字句為：「為符合資安規範，匯出之檔案將採取強制密碼加密。檔案開啟密碼預設為您的「登入帳號」（英文字母請大寫），請妥善保管下載檔案。」。

#### Scenario: 開啟對話框顯示密碼加密說明

- **WHEN** 使用者開啟自訂匯出報表對話框
- **THEN** Header 區的說明文字為上述資安密碼加密說明，內含「登入帳號」與「英文字母請大寫」字樣

### Requirement: `fb-toast` 支援選填說明第二行

`fb-toast` 的顯示介面 SHALL 接受選填的「說明」字串。當提供說明時，toast MUST 呈兩行：第一行為主訊息、第二行為較小字級的說明文字；未提供時 MUST 維持單行外觀。說明文字字級 MUST 以 `var(--…)` token 取用，MUST NOT 硬編。

#### Scenario: 帶說明的 toast

- **WHEN** 呼叫端顯示 toast 並傳入說明字串
- **THEN** toast 主訊息下方顯示第二行較小字級的說明文字

#### Scenario: 不帶說明的 toast

- **WHEN** 呼叫端顯示 toast 但未傳入說明
- **THEN** toast 僅顯示單行主訊息，外觀與既有一致

### Requirement: 匯出流程與結果提示

按下「匯出 Export」後，`fb-export-dialog` SHALL 先進入處理中（Loading）狀態（，匯出按鈕呈忙碌、選項不可再改），處理完成後關閉對話框並透過既有 `fb-toast` 顯示成功訊息「資料已匯出」，且 toast 第二行 MUST 顯示說明「檔案密碼預設為您的「登入帳號」」。本能力 MUST NOT 產生或下載實際檔案；匯出失敗狀態不在實作範圍內。

#### Scenario: 匯出成功

- **WHEN** 使用者在對話框點擊「匯出 Export」
- **THEN** 對話框先顯示處理中狀態，隨後關閉並在畫面右上出現成功 toast，主訊息「資料已匯出」、第二行說明「檔案密碼預設為您的「登入帳號」」

### Requirement: 卡片式選項共用樣式 `.select-card`

系統 SHALL 於 `assets/css/components.css` 提供卡片式可選項目的共用樣式 `.select-card`，涵蓋 radio 與 checkbox 兩種變體（`選單展開` 內各狀態）。每張卡片含選取標記、標題，選用的描述文字。狀態 MUST 涵蓋：未選（白底、次要框線）、選中（淺藍底、主色框、主色標記）、禁用（淡化、不可點）。此樣式 MUST 僅使用 `var(--…)` token，並可被 `fb-export-dialog` 以外的頁面沿用。

#### Scenario: 選中與未選

- **WHEN** 使用者點選一張 `.select-card`
- **THEN** 該卡片切換為選中樣式（淺藍底、主色框），radio 變體同群其他卡片回到未選樣式

#### Scenario: 禁用卡片

- **WHEN** 一張 `.select-card` 標記為禁用
- **THEN** 卡片呈淡化樣式且點擊不改變選取狀態

### Requirement: 境內客戶報表頁改用匯出對話框

[pages/domestic_basic_report.html](../../../pages/domestic_basic_report.html) 的「匯出報表 Export」按鈕 MUST 改為開啟 `fb-export-dialog`，取代現有的 `alert` 佔位。開啟時 MUST 依當前 filter 的「績效指標」與「資料日期（起）」值傳入佔比模式與簡化模式的條件旗標。頁面組裝方式 MUST 維持只載入共用資產並以 `fb-*` 元件組裝，不得複製元件標記或重新定義元件樣式。

#### Scenario: 按鈕開啟對話框

- **WHEN** 使用者於境內客戶報表頁點擊「匯出報表 Export」
- **THEN** 開啟 `fb-export-dialog` 而非彈出 `alert`，且條件旗標反映當前績效指標與資料日期（起）

### Requirement: `fb-export-dialog` 的 Figma 可追溯與 kitchen sink 覆蓋

新增 `fb-export-dialog` 與 `.select-card` 的變更 MUST 於 `design/components.md` 新增條目，記錄元件名稱、對應 Figma node id（至少含）、變體與狀態清單、使用到的 token；並 MUST 於 `pages/_components.html` 加入可與 Figma 逐一比對的實例，涵蓋預設、佔比禁用、簡化模式、Loading 等狀態。

#### Scenario: 文件與驗收頁同步

- **WHEN** `fb-export-dialog` 被加入元件庫
- **THEN** `design/components.md` 出現對應條目且含至少一個 Figma node id，`pages/_components.html` 出現涵蓋其狀態的實例

### Requirement: Modal／對話框僅能由按鈕或 Esc 關閉

所有 modal／對話框類元件（目前為 `fb-modal`、`fb-schedule-dialog`、`fb-confirm-dialog`、`fb-export-dialog`，以及未來新增的同類元件）MUST NOT 因使用者點擊遮罩或面板外部區域而關閉。對話框開啟後 MUST 僅能透過下列途徑關閉：

- 右上關閉鈕（×，`fb-close` 圖示）
- Footer 的 `取消 Cancel`（或等義的取消／關閉按鈕）
- 鍵盤 Esc

遮罩層 MUST 維持顯示並攔截點擊穿透，但點擊遮罩 MUST NOT 觸發關閉或任何 `cancel`／`close` 事件。此為跨元件通則，新增任何 modal／對話框元件時 MUST 遵循。

上述三種關閉途徑 MUST 於對話框「初次開啟」時即全部生效，不得因元件初始化（`connectedCallback`）過程中的例外而只剩 Esc 可用。

#### Scenario: 點擊遮罩不關閉

- **WHEN** 對話框已開啟，使用者點擊面板以外的遮罩區域
- **THEN** 對話框保持開啟，且不派發 `cancel`／`close`／`modal-close` 事件

#### Scenario: 關閉鈕與取消鈕仍可關閉

- **WHEN** 使用者點擊右上關閉鈕或 Footer 的 `取消 Cancel`
- **THEN** 對話框關閉，並依元件既有行為派發對應的取消／關閉事件

#### Scenario: Esc 仍可關閉

- **WHEN** 對話框為開啟狀態且使用者按下 Esc
- **THEN** 對話框關閉，等同點擊取消

#### Scenario: 初次開啟即可由按鈕關閉

- **GIVEN** 頁面載入後 `fb-schedule-dialog` 尚未被開啟過
- **WHEN** 使用者首次開啟該對話框，並點擊右上關閉鈕或 Footer 的 `取消 Cancel`
- **THEN** 對話框關閉（不需先按過 Esc、不需重新整理頁面）

#### Scenario: 匯出對話框套用通則

- **WHEN** `fb-export-dialog` 開啟中，使用者點擊面板外的遮罩區域
- **THEN** 對話框保持開啟，不派發取消或匯出事件（既有 `add-export-report-dialog` delta spec 中「遮罩點擊等同取消關閉」的字句一併校正為此行為）

### Requirement: Modal／對話框開啟時鎖定底層頁面捲動

所有全螢幕遮罩的 modal／對話框類元件（目前為 `fb-modal`、`fb-schedule-dialog`、`fb-confirm-dialog`、`fb-export-dialog`，以及未來新增的同類元件）MUST 在開啟時鎖定底層頁面（`body`）的捲動，並在關閉時解除。此為跨元件通則，新增任何同類元件時 MUST 遵循。

- 當有任一此類對話框開啟時，底層頁面 MUST NOT 可捲動。
- 多個對話框同時或堆疊開啟時，底層捲動 MUST 維持鎖定，直到最後一個關閉才解除（不得因其中之一關閉而提前解鎖）。
- 鎖定 MUST NOT 造成頁面內容因捲軸消失而產生可見的水平位移。
- 對話框在開啟狀態下被移出 DOM 時，底層捲動 MUST 仍能被正確解除，不得永久卡在鎖定狀態。
- 對話框內部自身的捲動區域（如可捲動 Body）MUST 不受影響、仍可正常捲動。

#### Scenario: 開啟對話框鎖定底層捲動

- **WHEN** 使用者開啟任一 modal／對話框元件
- **THEN** 底層頁面無法捲動，且頁面內容沒有明顯的水平跳動

#### Scenario: 關閉後恢復底層捲動

- **WHEN** 唯一開啟的對話框被關閉（透過關閉鈕、取消鈕或 Esc）
- **THEN** 底層頁面恢復可捲動，捲軸補償被還原

#### Scenario: 堆疊對話框僅在全部關閉後解鎖

- **WHEN** 一個對話框開啟中再開啟第二個（例如 modal 上疊出 `fb-confirm-dialog`），隨後關閉第二個
- **THEN** 底層頁面仍維持不可捲動，直到第一個對話框也關閉後才恢復

#### Scenario: 對話框於開啟中被移除仍解鎖

- **WHEN** 對話框在 `open` 狀態下自 DOM 被移除
- **THEN** 底層頁面捲動被解除，不會殘留鎖定

### Requirement: `fb-date-field` 支援 `min` / `max` 範圍限制

`fb-date-field` MUST 支援 `min` 與 `max` 兩個界線，可透過 HTML 屬性（`YYYY/MM/DD`）或 JS property 設定，且為可反應：在浮層開啟中變更 `min`/`max` MUST 立即重繪日曆。

- 日曆中早於 `min` 或晚於 `max` 的日期格 MUST 呈現為禁用且不可選取。
- 使用者按「確認」時，若當前草稿日期落在範圍外，元件 MUST NOT 接受該值、MUST NOT 派發 `change` 事件。
- 未設定 `min`/`max` 時，行為與現況相同（無範圍限制）。
- `min` 與 `max` 皆設定且 `min` 晚於 `max` 時，元件 MUST 不丟出例外；此情況下所有日期視為不可選。

#### Scenario: 超出範圍的日期在日曆中禁用

- **GIVEN** `fb-date-field` 設定 `min="2026/03/01"`
- **WHEN** 使用者開啟日曆並切換到 2026 年 2 月
- **THEN** 2 月所有日期格皆為禁用狀態，點擊無效

#### Scenario: 確認時拒絕範圍外日期

- **GIVEN** `fb-date-field` 設定 `max="2026/08/30"`
- **WHEN** 透過 property 將值設為 `2026/09/15` 後開啟浮層並按「確認」
- **THEN** 元件不接受該日期，`value` 不變為範圍外值，且不派發 `change`

#### Scenario: 開啟中更新界線即時重繪

- **GIVEN** `fb-date-field` 浮層為開啟狀態
- **WHEN** 外部程式將其 `min` 設為較晚的日期
- **THEN** 日曆立即重繪，新落入範圍外的日期格變為禁用

### Requirement: `fb-time-field` 支援 `min` / `max` 範圍限制

`fb-time-field` MUST 支援 `min` 與 `max`（`HH:MM`，24 小時制），可透過 HTML 屬性或 JS property 設定並為可反應。使用者以上下箭頭步進調整時、分後，元件 MUST 將結果值夾在 `[min, max]` 範圍內（clamp），不得產生範圍外的值，並在值有變動時派發 `change`。未設定時行為與現況相同。

#### Scenario: 步進超過上界時夾住

- **GIVEN** `fb-time-field` 值為 `17:00` 且設定 `max="17:30"`
- **WHEN** 使用者連續按「時 +1」
- **THEN** 值不會超過 `17:30`

#### Scenario: 步進低於下界時夾住

- **GIVEN** `fb-time-field` 值為 `09:00` 且設定 `min="09:00"`
- **WHEN** 使用者按「分 -1」
- **THEN** 值維持在 `09:00`，不回捲到 `08:59`

### Requirement: 成對日期／時間欄位聯動 `fbLinkRange`

系統 SHALL 提供共用函式 `fbLinkRange(startEl, endEl, { kind })`，`kind` 為 `'date'` 或 `'time'`，用於將「起」與「訖」兩個欄位相互約束，且 MUST NOT 因起訖欄位預填為相同值而使「起」欄位無法再往未來（更大值）方向選取：

- 監聽 `startEl` 的 `change`：將 `endEl.min` 設為 `startEl` 的目前值；若 `endEl` 目前值早於 `startEl` 的新值，MUST 一併將 `endEl` 推移至 `startEl` 的新值。
- 監聽 `endEl` 的 `change`：將 `startEl.max` 設為 `endEl` 的目前值。
- 呼叫時 MUST 立即套用一次上述約束的下界部分（`endEl.min` 來自 `startEl` 目前值）；MUST NOT 於此時以 `endEl` 的目前值回設 `startEl.max`，以免預填等值時鎖死「起」欄位。

如此使用者在 UI 上即無法選出「訖早於起」的組合（改由推移訖值達成），而「起」欄位仍可自由選取未來日期／時間。

#### Scenario: 選定起日後限制訖日下界

- **GIVEN** 一組以 `fbLinkRange(start, end, { kind: 'date' })` 綁定的日期欄位
- **WHEN** 使用者將起日改為 `2026/05/01`
- **THEN** 訖日欄位日曆中 `2026/05/01` 之前的日期全部禁用

#### Scenario: 選定訖時間後限制起時間上界

- **GIVEN** 一組以 `fbLinkRange(start, end, { kind: 'time' })` 綁定的時間欄位
- **WHEN** 使用者將結束時間改為 `12:00`
- **THEN** 開始時間欄位無法被步進到晚於 `12:00`

#### Scenario: 預填等值不鎖死起欄位

- **GIVEN** 一組以 `fbLinkRange(start, end, { kind: 'date' })` 綁定的日期欄位，`start` 與 `end` 皆預填為今天
- **WHEN** 綁定完成後使用者開啟起日欄位的日曆
- **THEN** 今天之後的未來日期皆為可選（不因 `end` 預填為今天而被禁用）

#### Scenario: 起值超過訖值時推移訖值

- **GIVEN** 一組以 `fbLinkRange(start, end, { kind: 'date' })` 綁定的日期欄位，`start` 與 `end` 皆為 `2026/05/01`
- **WHEN** 使用者將起日改為 `2026/05/10`
- **THEN** 訖日一併變為 `2026/05/10`，且不產生「訖早於起」的組合

### Requirement: 使用點在送出前驗證起訖區間

具備起訖日期或時間欄位的畫面 MUST 在送出動作前驗證「訖不早於起」，不合法時 MUST 阻止送出並提供可見提示。涵蓋下列使用點：

- **境內客戶報表搜尋列**：按「查詢」時，若資料日期(訖) 早於 資料日期(起)，MUST 顯示提示且不重新產生報表。
- **代理設定 Modal**：訖日早於起日時，MUST 顯示錯誤訊息且「儲存」按鈕為禁用；此驗證與既有的代理期間重疊檢查並存。
- **行事曆行程對話框 `fb-schedule-dialog`**：按「儲存」時 MUST 以 datetime 比較攔截無效區間 —— 結束日期早於開始日期，或起訖為同一日且結束時間早於開始時間時，MUST 標示無效欄位、不派發 `submit`、不關閉。定時模式允許跨日（結束日期較晚時，即使結束時間的時鐘值早於開始時間亦為有效）。欄位結構見「`fb-schedule-dialog` 起訖各自具備日期與時間」需求。

#### Scenario: 報表查詢攔截無效日期區間

- **GIVEN** 境內客戶報表起日為 `2026/08/01`
- **WHEN** 使用者將訖日設為 `2026/07/01` 並按「查詢」
- **THEN** 顯示「訖日不得早於起日」類提示，報表不重新產生

#### Scenario: 代理設定儲存被禁用

- **WHEN** 代理設定 Modal 中訖日早於起日
- **THEN** 顯示錯誤訊息且「儲存」按鈕為禁用狀態

#### Scenario: 行程對話框攔截同日時間反序

- **GIVEN** `fb-schedule-dialog` 定時模式，開始日期與結束日期同為 `2026/09/17`
- **WHEN** 開始時間 `15:00`、結束時間 `14:00`，使用者按「儲存」
- **THEN** 對話框不關閉、不派發 `submit`，並標示時間欄位為無效

#### Scenario: 行程對話框允許跨日區間

- **GIVEN** `fb-schedule-dialog` 定時模式，開始 `2026/09/17 22:00`
- **WHEN** 結束設為 `2026/09/18 06:00`，使用者按「儲存」
- **THEN** 視為有效，正常派發 `submit`（不因結束時間時鐘值早於開始時間而被攔截）

### Requirement: `fb-schedule-dialog` 起訖各自具備日期與時間

`fb-schedule-dialog`（新增／編輯行程對話框）SHALL 提供兩種變體，由「全天」checkbox 切換：

- **定時模式（`mode="timed"`，預設）**：SHALL 呈現「開始時間 Start Time」與「結束時間 End Time」兩列，每一列 SHALL 同時含一個日期欄位（`fb-date-field`）與一個時間欄位（`fb-time-field`）。兩列的值分別對應 `startDate` / `start` 與 `endDate` / `end`。
- **全天模式（`mode="allday"`）**：SHALL 呈現「開始日期 Start Date」與「結束日期 End Date」兩個 `fb-date-field`，無時間欄位。

行程 SHALL 允許跨日：結束日期得晚於開始日期。

`open(data)` 帶入的值與 `submit` 事件的 `detail` SHALL 使用下列欄位：`{ id, title, allDay, date, start, end, startDate, endDate, notes }`。定時模式下 `startDate` / `endDate` / `start` / `end` 皆為有效值；`date` SHALL 等於 `startDate`（供既有讀取端相容）。日期字串 SHALL 為 `YYYY/MM/DD`、時間為 `HH:MM`。

對話框開啟後 SHALL 綁定起訖欄位互相約束：以起日設定訖日日曆的可選下界；起訖為同一日時，另以起時間／訖時間互相約束時間欄位，使 UI 上無法直接選出「訖早於起」的組合。

按「儲存」時 SHALL 於標題檢查後進行區間驗證：

- 結束日期早於開始日期時，MUST 攔截、標示無效欄位、MUST NOT 派發 `submit`、MUST NOT 關閉。
- 起訖為同一日且結束時間早於開始時間時，MUST 以相同方式攔截。
- 區間有效時 SHALL 派發 `submit` 並關閉。

全天模式切換、標題必填、備註 100 字計數、遮罩不可關閉、Esc／取消／關閉鈕關閉並視為取消等既有行為 SHALL 不變。

#### Scenario: 定時模式起訖各自選日期與時間

- **WHEN** 於 `mode="timed"` 填入標題，開始設為 `2026/09/17 09:00`、結束設為 `2026/09/18 18:00`，按「儲存」
- **THEN** 派發 `submit`，`detail` 含 `startDate:"2026/09/17"`、`start:"09:00"`、`endDate:"2026/09/18"`、`end:"18:00"`、`allDay:false`，且 `date` 等於 `startDate`，對話框關閉

#### Scenario: 跨日行程為有效區間

- **GIVEN** `mode="timed"`，開始 `2026/09/17 22:00`
- **WHEN** 結束設為 `2026/09/18 06:00` 並按「儲存」
- **THEN** 視為有效，正常派發 `submit`（不因「結束時間 06:00 早於開始時間 22:00」而被攔截）

#### Scenario: 同日結束時間早於開始時間被攔截

- **GIVEN** `mode="timed"`，開始日期與結束日期同為 `2026/09/17`
- **WHEN** 開始時間 `15:00`、結束時間 `14:00`，按「儲存」
- **THEN** 對話框不關閉、不派發 `submit`，結束時間欄位標示為無效並顯示「結束時間不得早於開始時間」

#### Scenario: 結束日期早於開始日期被攔截

- **GIVEN** `mode="timed"` 或 `mode="allday"`，開始日期 `2026/09/17`
- **WHEN** 結束日期設為 `2026/09/16` 並按「儲存」
- **THEN** 對話框不關閉、不派發 `submit`，結束日期欄位標示為無效

#### Scenario: 切換全天

- **GIVEN** 定時模式已填入起訖日期與時間
- **WHEN** 勾選「全天」
- **THEN** 欄位切換為「開始日期」「結束日期」兩個 `fb-date-field`（隱藏時間欄位），已填入的起訖日期保留，送出時 `detail.allDay` 為 `true`

### Requirement: 共用表格排序函式 `fbSortRows`

系統 SHALL 提供單一共用的表格排序函式，供所有含「狀態（啟用／停用）」欄位的管理列表使用，取代各頁重複的排序實作。函式 MUST 接受來源列陣列與排序設定（目前點選的欄位與方向、欄位取值對照表），並回傳排序後的新陣列，不得變動來源陣列順序。

函式 MUST 依下列優先順序排序：

1. 啟用狀態群組：`active === true` 的列一律排在 `active === false` 的列之前。
2. 群組內欄位排序：若呼叫端提供了點選的排序欄位，套用該欄位的值比較與方向；未提供時，維持來源陣列的原始順序。
3. 最終 tie-break：以每列在資料初始化時標記的穩定序號（下稱 `_seq`）由小到大排序。

`_seq` MUST 於資料載入時一次性標記為該列在原始資料陣列中的索引，且在停用／啟用切換、編輯、篩選過程中維持不變。

#### Scenario: 未點選欄位排序時的預設次序

- **WHEN** 使用者開啟管理頁且未點選任何欄位排序
- **THEN** 列表先顯示所有啟用列（維持原始資料順序），再顯示所有停用列（維持原始資料順序）

#### Scenario: 點選欄位排序時停用列仍置底

- **WHEN** 使用者點選任一欄位進行排序（升冪或降冪）
- **THEN** 啟用列群組與停用列群組各自套用該欄位排序
- **AND** 所有停用列仍整體排在所有啟用列之後

#### Scenario: 停用後該列排到列表最後

- **WHEN** 使用者將某一啟用列改為停用並儲存
- **THEN** 該列在重新繪製後移動到停用群組
- **AND** 顯示在所有啟用列之後

#### Scenario: 重新啟用後精準回到原位置

- **GIVEN** 某列先前被停用而排到列表最後
- **WHEN** 使用者將該列重新改為啟用並儲存
- **THEN** 該列回到啟用群組
- **AND** 在啟用群組內的位置與它從未被停用時相同（由 `_seq` 或目前點選的欄位排序決定），不受停用／啟用往返影響

#### Scenario: 排序結果穩定且可重現

- **WHEN** 對同一組資料與同一組排序設定重複執行排序
- **THEN** 每次都得到完全相同的列順序，且相同排序鍵值的列不會互換位置

### Requirement: 管理頁採用一致的停用列排序行為

角色管理、使用者管理、組織管理、選單管理四個頁面 MUST 使用共用的 `fbSortRows` 函式繪製各自的資料表，並套用相同的「啟用置頂、停用置底、啟用歸位」規則。各頁 MUST NOT 自行實作與此規則不同的停用列排序邏輯。

組織管理 MUST 移除先前依 `createdAt` 由新到舊、且忽略排序方向的 tie-break，改用共用函式的 `_seq` 最終排序鍵。

#### Scenario: 四頁行為一致

- **WHEN** 在四個管理頁中的任一頁停用再重新啟用一筆資料
- **THEN** 每一頁都表現出相同行為：停用時排到停用群組最後、重新啟用時回到原本在啟用群組中的位置

#### Scenario: 篩選與排序組合下維持規則

- **GIVEN** 使用者已套用關鍵字或狀態篩選並點選了欄位排序
- **WHEN** 列表重新繪製
- **THEN** 僅顯示符合篩選條件的列，且啟用群組仍在停用群組之上、群組內依點選欄位與 `_seq` 排序

### Requirement: Design token 單一來源

系統 SHALL 以 `design/tokens.json` 作為所有 design token（色彩、字級、行高、字重、間距、圓角、尺寸）的唯一版本控管來源，並由它產生 `assets/css/tokens.css`（於 `:root` 宣告 CSS 自訂屬性）。`tokens.css` MUST NOT 被手動編輯。token 命名 MUST 對應 Figma library 的圖層／變數路徑（例如 `general/bg/container/primary-var2` → `--general-bg-container-primary-var2`），並區分 primitive、semantic、component 三層。

#### Scenario: 由 JSON 重新產生 CSS

- **WHEN** 開發者執行 token 建置指令
- **THEN** `assets/css/tokens.css` 依 `design/tokens.json` 完整重新產生，且產生檔內每個自訂屬性名稱可回溯到 `tokens.json` 中的對應項目

#### Scenario: 更新設計系統色彩

- **WHEN** Figma library 的某個變數值改變並更新到 `design/tokens.json`
- **THEN** 重新建置後所有頁面透過 `var(--…)` 取得新值，且無需修改任何頁面或元件檔

### Requirement: 禁止硬編樣式值

除 `assets/css/tokens.css` 外，任何 CSS、HTML 或 JS 檔 MUST NOT 出現硬編色值（`#rgb`、`#rrggbb`、`rgb`、`rgba`、`hsl` 具體色）。字級、間距、圓角等有對應 token 者 MUST 使用 `var(--…)`。專案 SHALL 提供一個可執行的檢查（lint）在違規時回報檔案與行號。

#### Scenario: 元件 CSS 引入硬編色

- **WHEN** 於 `assets/css/components.css` 新增一條使用 `#007aa7` 的規則
- **THEN** lint 指令以非零狀態結束並指出該檔案與行號

#### Scenario: 全綠通過

- **WHEN** 所有樣式值均透過 `var(--…)` 取用且 lint 執行
- **THEN** lint 指令以零狀態結束且無警告

### Requirement: 元件以傳統 script 的 Custom Elements 實作

每個可復用 UI 元件 SHALL 實作為一個 `fb-` 前綴的 Custom Element，定義於 `assets/js/components.js`。該檔 MUST NOT 使用 ES module 語法（`import` / `export`）或 `fetch`，MUST 能以傳統 `<script src>` 載入。元件 SHALL 以 light DOM 渲染（不使用 Shadow DOM），使全域 `tokens.css` 與 `components.css` 自然套用。元件的變體與狀態 SHALL 透過 HTML 屬性控制。

#### Scenario: 頁面以宣告式標記使用元件

- **WHEN** 一個頁面加入 `<fb-topnav active="report-zone"></fb-topnav>` 並載入共用 CSS 與 `components.js`
- **THEN** 該元件渲染出與 Figma 一致的導覽列，且 highlight 對應 `active` 屬性

#### Scenario: 單處修改全站生效

- **WHEN** 修改 `components.js` 中某個 `fb-*` 元件的標記或行為
- **THEN** 所有使用該元件的頁面在重新載入後皆反映變更，無需逐頁修改

### Requirement: 可於 file:// 本地開啟

任一頁面 SHALL 能在以整包資料夾交付時，於 `file://` 協定下（使用者本機雙擊開啟）正常渲染與互動，不依賴開發伺服器。專案 SHALL 提供建置指令，將某頁所需的 `assets/*`（CSS、JS、icon、資產）內嵌，輸出為單一自足的 HTML 檔至 `dist/`。

#### Scenario: 整包資料夾本地開啟

- **WHEN** 使用者以 `file://` 直接開啟含相對路徑 `assets/` 的頁面
- **THEN** 樣式、元件與互動皆正常，主控台無因 module／CORS／fetch 造成的錯誤

#### Scenario: 交付單檔

- **WHEN** 執行單檔建置指令指定某頁
- **THEN** `dist/<page>.html` 為不含外部相依的單一檔，於 `file://` 雙擊開啟後外觀與行為與開發版一致

### Requirement: 每個元件可追溯至 Figma

`design/components.md` SHALL 為每個 `fb-*` 元件記錄：元件名稱、對應的 Figma node id（一個以上）、變體與狀態清單、使用到的 token。新增或修改元件的變更 MUST 同步更新此文件，並在說明中附上與該 Figma node 的截圖對照。

#### Scenario: 新增元件

- **WHEN** 新增一個 `fb-*` 元件
- **THEN** `design/components.md` 出現對應條目且含至少一個 Figma node id，並附上截圖對照

### Requirement: Kitchen sink 驗收頁

專案 SHALL 維護 `pages/_components.html`，展示每個 `fb-*` 元件的每個變體與狀態。新增或修改元件的變更 MUST 更新此頁，使其涵蓋新的變體與狀態。此頁 SHALL 作為對照 Figma 設計稿的唯一畫布。

#### Scenario: 元件新增變體

- **WHEN** 一個 `fb-*` 元件新增一個變體
- **THEN** `pages/_components.html` 出現該變體的實例，可與對應 Figma node 逐一比對

### Requirement: 圖示以 registry 提供

所有圖示 SHALL 由 `assets/js/icons.js` 的單一 registry（`name → SVG 字串`）提供，並透過 `<fb-icon name="…">` 使用。SVG MUST 經過最佳化（例如 SVGO），MUST NOT 在頁面或元件標記中散布 inline SVG 字面值（`<fb-icon>` 內部除外）。新增圖示 SHALL 只在 registry 增加項目。

#### Scenario: 使用圖示

- **WHEN** 頁面或元件需要一個圖示
- **THEN** 以 `<fb-icon name="fb-plus">` 取用，且該名稱存在於 `icons.js` registry

#### Scenario: 頁面出現散落 SVG

- **WHEN** 某頁直接寫入 `<svg>…</svg>` 而非使用 `<fb-icon>`
- **THEN** 此情形違反本要求，應改為 registry 項目加 `<fb-icon>`

### Requirement: 新頁面組裝方式

後續每個新頁面 SHALL 僅由「載入共用 `tokens.css`、`base.css`、`components.css`、`components.js`」加上「`fb-*` 元件與版面容器的組裝標記」構成。頁面 MUST NOT 重新定義元件樣式或複製元件標記；頁面專屬且不可復用的區塊（如特定報表 `<table>`）MAY 保留於該頁，但其樣式值 MUST 全部使用 `var(--…)` token。

#### Scenario: 建立新頁面

- **WHEN** 新增一個頁面
- **THEN** 該頁的 `<head>` 只連結共用資產，`<body>` 主要由 `fb-*` 元件組成，且不含重複的元件 CSS 或元件標記副本

#### Scenario: 頁面專屬區塊

- **WHEN** 某頁需要一個不會被其他頁使用的客製區塊
- **THEN** 該區塊可寫在該頁，但所有色彩／間距／字級值皆以 token 取用，且通過禁止硬編樣式值的 lint


### Requirement: 日期＋時間複合欄位元件 `fb-datetime-field`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-datetime-field`，以單一輸入呈現「日期＋時間」值（顯示格式 `YYYY/MM/DD HH:MM`），展開浮層含月曆與時、分微調（ 內 `date picker-使用者登錄紀錄`）。元件 MUST 以 light DOM、傳統 script 實作，色值只能用 `var(--token)`。

元件 SHALL 提供 `value` 的 getter/setter，值變更時 MUST 對外派發變更事件。開啟浮層、選日期或調整時分後回填顯示字串；未選值時顯示 placeholder。關閉鈕以外的頁面點擊、Esc MUST 關閉浮層。

#### Scenario: 選取日期與時間

- **WHEN** 使用者開啟浮層、點選某日並調整時分
- **THEN** 輸入框顯示 `YYYY/MM/DD HH:MM`，並派發變更事件帶出該值

#### Scenario: 空值

- **WHEN** 元件未設定 `value`
- **THEN** 輸入框顯示 placeholder，`value` getter 回傳空字串

### Requirement: `fb-datetime-field` 支援成對起訖聯動

一對 `fb-datetime-field`（起／訖）SHALL 可透過既有的成對聯動機制（`fbLinkRange` 或等效介面）互相約束：訖值 MUST NOT 早於起值；當起值被改到晚於訖值時，訖值 MUST 推移跟上。

#### Scenario: 起值晚於訖值

- **WHEN** 已綁定的一對起／訖 `fb-datetime-field`，使用者把「起」改到晚於目前「訖」
- **THEN** 「訖」自動推移為不早於「起」

#### Scenario: 訖值下限

- **WHEN** 使用者展開「訖」的浮層
- **THEN** 早於「起」的日期／時間不可選取

### Requirement: 批次匯出對話框元件 `fb-batch-export-dialog`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-batch-export-dialog`，實作（`Dialog-匯出`，含「超過單次下載上限」變體）的批次匯出對話框。元件 MUST 以 light DOM、傳統 script 實作，色值只能用 `var(--token)`。

對話框內容 SHALL 包含：Header（標題「匯出」／副標「Export」、右上關閉鈕 `fb-close`）；資訊區塊顯示「查詢結果 共 N 筆」，當 N 超過單次下載上限時額外顯示「超過單次下載上限（M 筆），系統將自動分批下載 共 B 批」（`B = ceil(N / M)`）與註記「每批約 M 筆，檔案格式：CSV」；Footer 含「取消」（外框鈕）與主按鈕（未超過上限時文案為「下載」，超過時為「分批下載」）。

元件 SHALL 提供開啟／關閉的程式介面，開啟介面 MUST 接受查詢筆數 `N` 與選填的單次上限 `M`（預設 2,000）。使用者確認與取消時 MUST 分別對外派發 `export` 與 `cancel` 事件；`export` 事件 payload MUST 帶出 `N`、`M` 與批數 `B`。關閉鈕、Esc 與「取消」MUST 皆等同取消並關閉；點擊遮罩 MUST NOT 關閉對話框；開啟時 MUST 鎖定底層頁面捲動。

#### Scenario: 未超過上限

- **WHEN** 以 `N = 1500` 開啟對話框
- **THEN** 顯示「查詢結果 共 1,500 筆」，不顯示分批提示，主按鈕文案為「下載」

#### Scenario: 超過上限顯示批數

- **WHEN** 以 `N = 10000`、`M = 2000` 開啟對話框
- **THEN** 顯示「共 10,000 筆」「系統將自動分批下載 共 5 批」「每批約 2,000 筆，檔案格式：CSV」，主按鈕文案為「分批下載」

#### Scenario: 確認匯出

- **WHEN** 使用者點主按鈕
- **THEN** 派發 `export` 事件，payload 含 `N`、`M`、`B`，對話框關閉

#### Scenario: 取消不關閉於遮罩

- **WHEN** 使用者點擊遮罩
- **THEN** 對話框維持開啟；改按關閉鈕、Esc 或「取消」則關閉並派發 `cancel`

### Requirement: `fb-toast` 支援 `tone="danger"` 變體

`fb-toast` 的顯示介面 SHALL 接受選填的語氣（tone）參數，值為 `success`（預設）或 `danger`。`danger` 時 toast MUST 以紅色系呈現（背景、文字、前置圖示 `fb-close-circle` 皆取用對應 `var(--…)` token，MUST NOT 硬編）；其餘行為（右上定位、可關閉、自動消失、選填第二行說明）與 `success` 一致。

#### Scenario: danger toast

- **WHEN** 呼叫端以 `tone="danger"` 顯示 toast
- **THEN** toast 以紅色系呈現、前置圖示為 `fb-close-circle`，主訊息與可選說明比照 success 版面

#### Scenario: 預設仍為 success

- **WHEN** 呼叫端未指定 tone
- **THEN** toast 呈現既有的 success 綠色樣式

### Requirement: `fb-datetime-field` 與 `fb-batch-export-dialog` 的 Figma 可追溯與 kitchen sink 覆蓋

新增 `fb-datetime-field`、`fb-batch-export-dialog` 與 `fb-toast` danger 變體 MUST 於 `design/components.md` 新增／更新條目，記錄元件名稱、對應 Figma node id（至少含）、變體與狀態清單、使用到的 token；並 MUST 於 `pages/_components.html` 加入可與 Figma 逐一比對的實例，涵蓋：`fb-datetime-field` 空值／已選值／起訖聯動、`fb-batch-export-dialog` 未超上限／超過上限、`fb-toast` success／danger。

#### Scenario: 文件與驗收頁同步

- **WHEN** 上述元件與變體被加入元件庫
- **THEN** `design/components.md` 出現對應條目且各含至少一個 Figma node id，`pages/_components.html` 出現涵蓋其狀態的實例

### Requirement: 動作按鈕採一致的中英雙語標籤

所有管理頁與元件庫 kitchen sink 中的動作按鈕文字 SHALL 採「中文 ＋ 半形空格 ＋ 英文」格式，並依動作類型使用下列標準字串：

- **新增類**（開啟新增 Modal 的工具列主按鈕）：中文為 `新增<對象>`，英文一律 `Add`，組合為 `新增<對象> Add`（例：`新增角色 Add`、`新增使用者 Add`、`新增代理設定 Add`）。
- **編輯類**（清單列開啟編輯 Modal）：一律 `編輯 Edit`，不使用 `編輯設定` 等變體。
- **刪除類**：一律 `刪除 Delete`。清單列與 Modal 底部的刪除按鈕 SHALL 採「淺灰邊框（`--line`）＋紅字（`--color-red-550`）＋白底」樣式，不使用紅色邊框；確認對話框的主刪除動作仍為紅色邊框樣式。
- **查看類**（清單列以唯讀方式開啟 Modal）：一律 `查看 View`，不使用 `查看設定` 等變體。
- **關閉類**（可見文字的關閉按鈕）：一律 `關閉 Close`。

僅有圖示、以 `aria-label` 提供無障礙名稱的關閉鈕（×）不受本規範約束，維持 `aria-label="關閉"`。

`design/components.md` 與 `pages/_components.html` SHALL 反映上述標準字串，且與對應 Figma node保持可追溯。

#### Scenario: 新增按鈕帶英文 Add

- **WHEN** 任一管理頁（使用者／角色／組織／選單／代理設定）渲染工具列的新增主按鈕
- **THEN** 按鈕文字為 `新增<對象> Add`，且保留既有的加號圖示

#### Scenario: 編輯按鈕統一文案

- **WHEN** 清單列渲染開啟編輯 Modal 的按鈕
- **THEN** 按鈕文字為 `編輯 Edit`

#### Scenario: 刪除按鈕統一文案與樣式

- **WHEN** 清單列或 Modal 底部渲染刪除動作按鈕
- **THEN** 按鈕文字為 `刪除 Delete`，且採淺灰邊框＋紅字＋白底樣式（非紅色邊框），帶垃圾桶圖示

#### Scenario: 查看與關閉按鈕統一文案

- **WHEN** 清單列渲染唯讀進入按鈕，或 Modal 底部渲染可見文字的關閉按鈕
- **THEN** 前者文字為 `查看 View`，後者文字為 `關閉 Close`

#### Scenario: kitchen sink 與文件同步

- **WHEN** 本規範的按鈕文案調整完成
- **THEN** `pages/_components.html` 的動作按鈕示例與 `design/components.md` 描述一併更新為標準字串

### Requirement: 首頁表格表頭採中英上下、靠左對齊

首頁（`index.html`）所有表格（行事曆事件清單 `.cal-events`、客戶列表 `.cl-table`）的表頭儲存格 SHALL 以中文在上、英文在下的兩行形式呈現，英文為次要樣式（較小字級、次要色）。所有表頭儲存格（含數值欄）SHALL 靠左對齊；數值欄的內容儲存格維持靠右對齊不變。行事曆「服務／活動」分頁的表頭亦 SHALL 補上對應英文。

#### Scenario: 表頭中英上下排列

- **WHEN** 首頁任一表格渲染表頭
- **THEN** 每個表頭儲存格顯示中文於上、英文於下兩行，且靠左對齊

#### Scenario: 數值欄表頭靠左、內容仍靠右

- **WHEN** 客戶列表表格渲染
- **THEN** 「日成交金額（元）Daily Turnover」表頭靠左對齊，其資料列金額仍靠右對齊並使用等寬數字

### Requirement: 資訊表元件 `fb-info-table`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-info-table`，以 label／value 兩欄的資訊表呈現一組唯讀明細列（對照 Figma `informational table-cell` /，用例見 `Dialog-操作軌跡明細`）。元件 MUST 以 light DOM、傳統 script 實作，色值只能用 `var(--token)`。

元件 SHALL 由一組 rows 資料驅動（每列含 `label` 與 `value` 兩個字串欄位），可透過內嵌 `<script type="application/json">` 或程式介面設定。渲染時：label 欄 SHALL 為固定寬度、value 欄佔滿剩餘寬度；相鄰列 SHALL 以白（`--table/info-table/cell/bg/white`）與藍（`--table/info-table/cell/bg/blue`）交錯背景呈現；每列高度 SHALL 對齊設計稿（單行約 48px，長值可換行撐高）；`value` 為空字串時 SHALL 顯示「-」。元件 SHALL NOT 具排序、篩選或列互動行為。

#### Scenario: 由 rows 渲染

- **WHEN** 以含 5 列的 rows 設定 `fb-info-table`
- **THEN** 依序渲染 5 列，label 欄等寬對齊，背景白／藍交錯，長 value 自動換行且該列撐高

#### Scenario: 空值以破折號呈現

- **WHEN** 某列的 `value` 為空字串
- **THEN** 該列 value 欄顯示「-」

### Requirement: 載入中圖示 `fb-loader` 與按鈕處理中狀態

圖示 registry SHALL 提供 `fb-loader`（環形載入圖示，`currentColor`、可旋轉）。共用樣式 SHALL 提供 `.is-loading` 修飾類：套用於按鈕時，內含的圖示 SHALL 持續旋轉、按鈕 SHALL 不可再次點擊（`pointer-events:none` 並降低不透明度）；色值 MUST 只用 `var(--token)`（旋轉為純 transform 動畫，不涉色值）。（「匯出 Export」按鈕處理中狀態）。

#### Scenario: 按鈕處理中

- **WHEN** 呼叫端為某按鈕加上 `.is-loading` 並將其圖示換為 `fb-loader`
- **THEN** 該圖示持續旋轉、按鈕不回應點擊；移除 `.is-loading` 後恢復正常

### Requirement: `fb-info-table` 的 Figma 可追溯與 kitchen sink 覆蓋

新增 `fb-info-table` MUST 於 `design/components.md` 新增條目，記錄元件名稱、對應 Figma node id（至少含）、rows 資料格式、使用到的 token；並 MUST 於 `pages/_components.html` 加入可與 Figma 逐一比對的實例，涵蓋：一般多列資訊表、含長值換行列、含空值（「-」）列。

#### Scenario: 文件與驗收頁同步

- **WHEN** `fb-info-table` 被加入元件庫
- **THEN** `design/components.md` 出現對應條目且含至少一個 Figma node id，`pages/_components.html` 出現涵蓋其狀態的實例

### Requirement: 表單欄位標題（`<label>`）共用排版規範

所有表單欄位（搜尋／篩選列的 `.field`、五個管理頁 Modal 的 `.as-field` / `.mm-field` / `.om-field` / `.rm-field` / `.um-field`，以及行程對話框 `.sched__field` 的 `.sched__lbl`）的欄位標題 SHALL 採單一組排版值 的 `Content/CN/H6 (Sm)` 與 `form/text/title/default`：

- 字型 MUST 為 `var(--font-cn)`。
- 字級 MUST 為 `14px`（`var(--fs-sm)`），不得為 `13px`。
- 字重 MUST 為 `500`（`var(--fw-medium)`）。
- 行高 MUST 為 `20px`（`var(--lh-sm)`）。
- 主要文字色 MUST 為 `#0c0e1f`（`var(--form-label-text)`，其值為 `var(--color-ink)`）；不得使用 `var(--text-muted)` 或其他灰階。

欄位標題內的次要文字（英文對照 `.en`、`(可多選)` / `(選填)` 等括號註記）MUST 使用 `#5e5f6b`（`var(--form-label-note)`，其值為 `var(--color-slate-550)`）。

欄位標題與其正下方控制項之間的垂直間距 MUST 為 `2px`（`var(--gap-2xs)`，對照 Figma `component/gap-2xs` / `text/sub-margin-top-sm`）。

上述值 MUST 只以 `var(--token)` 表達，token 以 `design/tokens.json` 為單一來源（`assets/css/tokens.css` 由 `npm run build:tokens` 產生）。個別頁面 MUST NOT 以硬編碼字級或顏色重新定義欄位標題樣式。

必填標記 `<em>*</em>` 的紅色（`var(--accent-danger)`）與驗證錯誤訊息 `.field__err` / `.sched__err` 不在本規範調整範圍，維持現況。

#### Scenario: 搜尋列欄位標題對齊設計稿

- **WHEN** 任一頁面渲染 `.filter__grid` 內的 `.field > label`
- **THEN** 該標題為 `14px` / 字重 `500` / 行高 `20px` / 顏色 `#0c0e1f`，且其 `.en` 子元素顏色為 `#5e5f6b`

#### Scenario: 管理頁 Modal 欄位標題與搜尋列一致

- **WHEN** 使用者／角色／組織／選單／代理設定任一 Modal 渲染 `*-field > label`
- **THEN** 其字級、字重、行高、主色與 `.field > label` 完全相同，且不再各自宣告 `font-size: 13px`

#### Scenario: 行程對話框欄位標題一致

- **WHEN** `assets/js/components.js` 渲染排程表單的 `.sched__lbl`
- **THEN** 其排版值與 `.field > label` 相同

#### Scenario: 標題與控制項間距

- **WHEN** 任一表單欄位標題後接日期／下拉／輸入等控制項
- **THEN** 標題與控制項的垂直間距為 `2px`

#### Scenario: token 為單一來源

- **WHEN** 檢視欄位標題相關 CSS 宣告
- **THEN** 顏色與字級皆為 `var(--…)`，且 `--form-label-text`、`--form-label-note`、`--gap-2xs`、`--color-slate-550` 均定義於 `design/tokens.json` 並反映在 `assets/css/tokens.css`

### Requirement: 日期／時間欄位圖示顏色對齊設計稿

`.date-ctrl`、`.time-ctrl`、`.dtfield` 內的行事／時鐘圖示（`.cal`）顏色 SHALL 為主色藍 `#007aa7`（`var(--accent-primary)` 內日期／時間欄位的圖示），不得使用 `var(--color-grey-550)` 或黑色 `var(--color-ink)`。圖示尺寸與位置維持現況。

#### Scenario: 日期欄位圖示顏色

- **WHEN** 渲染 `fb-date-field` / `fb-time-field` / `fb-datetime-field` 的欄位圖示
- **THEN** 圖示顏色為主色藍 `#007aa7`

### Requirement: 欄位標題規範的文件與 kitchen sink 同步

`design/components.md` 的欄位標題／`fb-filter-card` 說明 MUST 記載本規範的字級（`14px`）、字重（`500`）、行高（`20px`）、主色（`form-label-text`）與次要文字色（`form-label-note`）及 `2px` 間距，並標註對應。`pages/_components.html` 的 `fb-filter-card` 範例 MUST 呈現符合本規範的欄位標題，可與 Figma 逐一比對。

#### Scenario: 文件反映欄位標題規範

- **WHEN** 本變更完成
- **THEN** `design/components.md` 描述與 `pages/_components.html` 範例均符合上述排版值，並可追溯至

### Requirement: 欄位浮層採 `fixed` 定位並掛載於 `body`

`fb-date-field`、`fb-time-field` 與 `fb-datetime-field` 的展開浮層（日曆／時間微調層）SHALL 以「掛載於 `<body>` 的 `position: fixed` 浮層」方式呈現，使其不受任一祖先容器的 `overflow` 裁切或 `transform` 包含塊限制而被切斷。此為三個欄位元件共用的通則。

- 浮層開啟時 MUST 被移動為 `document.body` 的子節點；關閉時 MUST 還原回原欄位元件內。
- 浮層顯示與否 MUST 由浮層自身的狀態類（`is-open`）控制，MUST NOT 依賴「宿主元件加 `open` 類 + 後代選擇器」。
- 浮層的堆疊層級 MUST 高於全螢幕遮罩的對話框（`fb-modal` / `fb-schedule-dialog` / `fb-confirm-dialog` / `fb-export-dialog` 等），使欄位浮層在對話框內開啟時完整顯示於對話框之上。
- 系統 SHALL 提供單一共用的浮層定位函式（`FbOverlays.place(anchor, pop)` 或等效介面），行為為：
  - 預設將浮層對齊觸發欄位的正下方，與欄位間保留固定間距（約 6px）。
  - 當下方剩餘空間不足以容納浮層、且上方空間足夠時，MUST 改置於欄位上方。
  - 最終 MUST 將浮層夾在可視視窗內，四邊保留最小邊距（約 8px）。
- 浮層開啟期間，系統 MUST 監聽視窗捲動（含捕獲階段，涵蓋對話框內文等內層捲動容器）與視窗尺寸變化，並即時重新定位浮層；關閉時 MUST 解除這些監聽。
- `fb-modal` 與 `fb-schedule-dialog` 關閉時 MUST 一併關閉所有開啟中的欄位浮層。
- 點擊 `fb-date-field`、`fb-time-field`、`fb-datetime-field` 以外的頁面區域 MUST 關閉開啟中的欄位浮層（既有的 Esc 關閉行為不變）。

本需求僅規範浮層的定位與掛載方式；各欄位元件的值格式、事件、min／max、起訖聯動等既有行為 SHALL 不變。

#### Scenario: 對話框內開啟日期浮層不被裁切

- **WHEN** 使用者於 `fb-schedule-dialog` 內點開某個 `fb-date-field` 的日曆
- **THEN** 日曆浮層完整顯示且不被對話框面板或其可捲動內文裁切，並疊在對話框之上

#### Scenario: 捲動對話框內文時浮層跟隨錨點

- **GIVEN** `fb-schedule-dialog` 內某欄位的浮層為開啟狀態
- **WHEN** 使用者捲動對話框的可捲動內文
- **THEN** 浮層即時重新定位，持續貼齊該欄位；欄位捲出可視範圍時浮層隨之移動

#### Scenario: 下方空間不足時浮層上翻

- **WHEN** 觸發欄位太接近視窗底部，下方不足以容納浮層而上方足夠
- **THEN** 浮層改顯示於欄位上方，且整體仍被夾在視窗可視範圍內

#### Scenario: 關閉對話框一併關閉欄位浮層

- **GIVEN** `fb-modal` 或 `fb-schedule-dialog` 內有一個欄位浮層為開啟狀態
- **WHEN** 使用者關閉該對話框（關閉鈕／取消／Esc）
- **THEN** 對話框關閉，該欄位浮層一併關閉並將節點還原回欄位元件內

#### Scenario: 點擊欄位外部關閉浮層

- **WHEN** `fb-datetime-field`（或 `fb-date-field` / `fb-time-field`）浮層開啟中，使用者點擊三者以外的頁面區域
- **THEN** 浮層關閉

### Requirement: `fb-schedule-dialog` 面板採固定頁首／捲動內文／固定頁尾三段式

`fb-schedule-dialog` 的面板結構 SHALL 與 `fb-modal` 一致，採三段式：固定頁首、可捲動內文、固定頁尾。

- 面板容器（`.sched__panel`）MUST 為 `overflow: hidden`，本身不整塊捲動。
- 頁首區（`.sched__hd`，含標題／副標）MUST 固定於面板頂部、不隨內文捲動。
- 內文區（`.sched__body`，含所有欄位）MUST 為面板內唯一的垂直捲動區域，內容超出面板高度時於此區內捲動；MUST 使用穩定的捲軸槽（`scrollbar-gutter: stable` 或等效手法），避免捲軸出現／消失造成內容水平位移。
- 頁尾區（`.sched__ft`，含儲存／取消按鈕）MUST 固定於面板底部、不隨內文捲動，並維持上緣分隔線。
- 內距 MUST 由面板容器移至各分段，使頁首／頁尾在內文捲動時保持視覺完整。

「全天」切換、欄位語意、起訖聯動與送出前驗證、標題必填、備註字數、遮罩不可關閉、Esc／取消／關閉鈕關閉並視為取消等既有行為 SHALL 不變。

#### Scenario: 內文超出時只捲動內文區

- **GIVEN** `fb-schedule-dialog` 已開啟且欄位內容高度超過面板可用高度
- **WHEN** 使用者在對話框內捲動
- **THEN** 僅 `.sched__body` 捲動，頁首標題與頁尾按鈕維持固定可見

#### Scenario: 捲軸不造成內容水平位移

- **WHEN** `.sched__body` 因內容增減而出現或隱藏捲軸
- **THEN** 內文欄位沒有可見的水平跳動

### Requirement: 搜尋列動作鈕排列順序

所有搜尋列的動作區塊 `.filter__actions` MUST 依「左＝重設、右＝查詢」排列：DOM 順序上 `重設`（`btn-text muted`，`fb-reset` 圖示）MUST 在前，`查詢`（`btn-text`，`fb-search` 圖示）MUST 在後。容器 MUST 維持靠右對齊（`justify-content: flex-end`）。此排列 MUST 套用於所有含搜尋列的頁面（首頁客戶清單、境內客戶報表、使用者管理、角色管理、組織管理、選單管理、代理設定、使用者登入紀錄、使用者軌跡查詢）。

按鈕文案與行為不變：條件 MUST 僅在按「查詢」時套用，「重設」MUST 還原完整清單並依各頁既有規則清除排序與欄位。此需求僅規範視覺與 DOM 排列順序。

`pages/_components.html` 的搜尋列／`.filter__actions` 範例與 `design/components.md` 的對應描述 MUST 反映此順序。

#### Scenario: 搜尋列動作鈕順序

- **WHEN** 任一含搜尋列的頁面渲染 `.filter__actions`
- **THEN** 第一顆按鈕為「重設 Reset」、第二顆為「查詢 Search」，且兩者靠右對齊

#### Scenario: kitchen sink 與文件同步

- **WHEN** 檢視 `pages/_components.html` 的搜尋列範例與 `design/components.md` 的 `.filter__actions` 說明
- **THEN** 皆呈現「重設在左、查詢在右」的順序，可與設計稿逐一比對

### Requirement: 基礎報表表格重繪時保留頁面捲動位置

境內客戶報表（`pages/domestic_basic_report.html`）與境外客戶報表（`pages/foreign_basic_report.html`）的 `.report` 表格在任何觸發整段重繪的操作（群組列 [+]/[-] 收合展開、年度 toggle、月份橫向展開 toggle、排序、容器寬度變化）後，MUST 保留使用者原本的捲動位置，包含：

- 頁面（`window`）捲動位置。
- `.table-wrap` 內部捲動位置（`scrollLeft` 與 `scrollTop`）。

重繪前後的可視內容（使用者正在檢視的列與欄）MUST 維持一致，不得因重繪造成頁面自動跳動至頂部或其他非使用者主動操作的位置。

#### Scenario: 頁面捲動至表格下方時收合群組列

- **WHEN** 使用者將頁面捲動至表格下半部後，點擊某群組列的收合（`-`）按鈕
- **THEN** 頁面（`window`）捲動位置維持不變，使用者原本檢視的區域仍在可視範圍內，畫面不跳動回頂部

#### Scenario: 收合群組列使表格變短

- **WHEN** 收合群組列導致 `.table-wrap` 內容高度縮短、頁面總高度隨之變矮
- **THEN** 系統 MUST 主動還原重繪前的 `window` 捲動位置（不依賴瀏覽器預設行為），避免瀏覽器因頁面變矮自動夾回捲動位置

#### Scenario: 點擊年度展開／收合 toggle

- **WHEN** 使用者點擊年度 toggle（如 `y2025Toggle`／`y2026Toggle`）展開或收合該年度月份欄
- **THEN** 頁面捲動位置與 `.table-wrap` 內部捲動位置皆維持重繪前狀態，不跳動

#### Scenario: 點擊月份橫向展開 toggle

- **WHEN** 使用者點擊月份 toggle 展開或收合該月的週資料與分析欄
- **THEN** 頁面捲動位置與 `.table-wrap` 內部捲動位置皆維持重繪前狀態，不跳動

### Requirement: 境外客戶報表頁組裝
境外客戶報表頁 `pages/foreign_basic_report.html` MUST 沿用境內客戶報表頁（`pages/domestic_basic_report.html`）的整體組裝方式：`fb-topnav` 頂部導覽、`fb-area-title`（zh="境外客戶報表", en="Overseas Client Report"）、`fb-tabbar`（`active` 指向「境外客戶報表」項目，Tab 清單與境內頁一致）、Filter 篩選區、Table 操作列（含「交易資料最新日期」與「匯出報表」按鈕）、報表 `<table>`、`fb-export-dialog`、`fb-toast`。報表引擎（年度展開／月份展開接週資料與分析欄／非1號開始簡化模式／排序／窄表填滿容器）MUST 與境內頁行為一致。

#### Scenario: 分頁作用狀態
- **WHEN** 使用者開啟 `pages/foreign_basic_report.html`
- **THEN** `fb-tabbar` 的「境外客戶報表」項目呈現作用中狀態，其餘分頁項目與境內頁一致可切換

#### Scenario: 報表引擎行為對齊境內頁
- **WHEN** 使用者於境外頁展開／收合年度、展開某月份的週資料與分析欄、或將「資料日期（起）」改為非當月 1 號
- **THEN** 報表 `<table>` 的欄位展開、非1號開始簡化模式（單一「累計{績效指標}」欄）、排序、窄表填滿容器等行為與境內客戶報表頁一致

### Requirement: 境外篩選區新增境外分類欄位
境外客戶報表頁的 Filter 篩選區 MUST 在「集團戶／客戶類型／產業類別」同一列新增第 4 個欄位「境外分類（可多選）」（`fb-dropdown[type="multi"][search][data-k="foreignCategory"]`），使該列由 3 欄改為 4 欄；「客戶群」欄位標籤 MUST 顯示為「客戶群/客戶群代號」。其餘欄位（績效指標、商品、資料日期起訖、帳號/ID、業務員/員編）MUST 與境內頁一致。

#### Scenario: 境外分類欄位可多選並可搜尋
- **WHEN** 使用者點開「境外分類」下拉
- **THEN** 欄位支援多選與關鍵字搜尋，行為與其他 `type="multi" search` 篩選欄位一致

### Requirement: 產業類別子群組收合層級
境外客戶報表的報表 `<table>` 的凍結標籤欄 MUST 為 5 欄（集團戶／客戶類型／產業類別／境外分類／客戶群名稱與代號合併欄）。每一個產業類別（科技業、製造業、金融業、物流業、銀行、外資）底下 MUST 都有一層可展開/收合的子群組列（欄位沿用「境外分類」欄名），客戶群列收在該子群組列之下，形成 集團戶 > 客戶類型 > 產業類別 > 子群組 > 客戶群 四層可展開/收合的階層；「客戶類型=一般、產業類別=外資」路徑 MUST 進一步拆成「外資機構」「外資基金」兩個子群組。

#### Scenario: 收合任一產業類別的子群組
- **WHEN** 使用者收合任一產業類別（例如「金融業」）下的子群組列
- **THEN** 該子群組底下的客戶群列全部隱藏，其餘產業類別的子群組與客戶群列不受影響

#### Scenario: 外資類別拆為兩個子群組
- **WHEN** 使用者展開「客戶類型=一般、產業類別=外資」的產業類別列
- **THEN** 顯示「外資機構」「外資基金」兩個可各自獨立收合的子群組列，其下分別為對應的客戶群列

#### Scenario: 展開子群組進入客戶群明細
- **WHEN** 使用者展開任一子群組並點擊其下某個客戶群列的合併欄文字連結（例如「迅捷物流 / C001」）
- **THEN** 該合併儲存格整串文字皆呈現連結樣式，點擊任一位置都會以與境內頁相同的 drill-down 行為開啟該客戶群的明細分頁，明細分頁的路徑標籤包含該客戶群所屬的完整五層資訊

### Requirement: 凍結標籤欄溢出文字截斷與 tooltip
境外客戶報表的凍結標籤欄（集團戶／客戶類型／產業類別／境外分類／客戶群名稱與代號合併欄，總覽表與客戶群明細表皆同）MUST 在內容寬度超出欄寬時以省略號截斷，且 MUST 提供 hover 顯示完整文字的 tooltip；此行為與該欄是否同時為客戶群連結無關，兩者可並存。

#### Scenario: 長文字欄位截斷並可 hover 顯示完整內容
- **WHEN** 凍結標籤欄的文字寬度超過欄寬（例如較長的子群組名稱，或「客戶群名稱 / 代號」合併文字）
- **THEN** 儲存格文字以省略號截斷顯示，滑鼠停留於該儲存格時顯示完整文字（含名稱與代號）的 tooltip

### Requirement: 客戶群名稱與代號合併欄位呈現
境外客戶報表的總覽表與客戶群明細鑽取表，MUST 將「客戶群」（名稱）與「客戶群代號」合併為單一凍結標籤欄，欄位標題顯示為「客戶群/代號」（英文：Client/Code）；儲存格內容 MUST 以「{客戶群名稱} / {客戶群代號}」單行文字呈現（例："迅捷物流 / C001"），名稱與代號皆為空的資料列（總計列、集團戶列、客戶類型列、產業類別列、子群組列）該欄 MUST 顯示為空白。

#### Scenario: 客戶群明細列顯示合併文字
- **WHEN** 報表列為客戶群明細列（`kind: 'detail'`）
- **THEN** 該列的合併欄顯示「{客戶群名稱} / {客戶群代號}」單行文字，例如「迅捷物流 / C001」

#### Scenario: 非客戶群明細列合併欄留白
- **WHEN** 報表列為總計、集團戶、客戶類型、產業類別或子群組列
- **THEN** 該列的合併欄不顯示任何文字

### Requirement: 匯出對話框新增境外分類彙總選項
境外客戶報表頁呼叫的 `fb-export-dialog` MUST 在「客戶明細層級」選項中，於「產業類別彙總」與「客戶群彙總」之間新增「境外分類彙總」選項（說明文案：呈現至「境外分類」彙總列）；其餘既有選項（集團戶彙總、產業類別彙總、客戶群彙總）與境內頁行為一致。境內客戶報表頁呼叫 `fb-export-dialog` 時 MUST NOT 出現「境外分類彙總」選項。

#### Scenario: 境外頁匯出對話框顯示境外分類彙總選項
- **WHEN** 使用者於境外客戶報表頁點擊「匯出報表」
- **THEN** 開啟的匯出對話框「客戶明細層級」選項列表依序包含：集團戶彙總、產業類別彙總、境外分類彙總、客戶群彙總、子帳號明細

#### Scenario: 境內頁匯出對話框不受影響
- **WHEN** 使用者於境內客戶報表頁點擊「匯出報表」
- **THEN** 開啟的匯出對話框「客戶明細層級」選項列表維持既有選項（集團戶彙總、產業類別彙總、客戶群彙總、客戶帳號明細），不包含「境外分類彙總」

### Requirement: 匯出對話框最後一層改名為子帳號明細
境外客戶報表頁的 `fb-export-dialog`「客戶明細層級」最後一個選項 MUST 顯示為「子帳號明細」，其說明文案 MUST 為「展開至客戶名稱、主帳號、子帳號、業務員。」；境內客戶報表頁維持既有「客戶帳號明細」（說明文案「展開至客戶名稱、主帳號、業務員。」，不含「子帳號」）。兩者鍵值皆為 `account`，選取後「彙總計算」兩個選項的停用/清空連動行為 MUST 與既有邏輯一致。

#### Scenario: 境外頁顯示子帳號明細選項
- **WHEN** 使用者於境外客戶報表頁的匯出對話框選取「客戶明細層級」的最後一個選項
- **THEN** 該選項標題為「子帳號明細」，說明文字包含「子帳號」；「彙總計算」的「包含小計」「包含總計」兩個選項強制取消勾選並停用

### Requirement: 選取子帳號明細時顯示隱碼警示並停用 專案交易匯出
境外客戶報表頁的 `fb-export-dialog` 於「客戶明細層級」選取「子帳號明細」時，MUST 在該區塊內顯示警示文字「子帳號展開後資料筆數極多。系統將自動對客戶主帳號進行隱碼遮蔽（如 969***45），子帳號則完整呈現。」，警示圖示 MUST 為 `fb-alert-triangle`（三角形驚嘆號，非 `fb-info-filled`），底色/文字色沿用 `--tag-bg-warning`/`--tag-text-warning`；同時「專案交易匯出」開關 MUST 被強制關閉且停用（不可操作）。切回其他任一「客戶明細層級」選項時，警示文字 MUST 隱藏，「專案交易匯出」開關 MUST 恢復可操作並還原為預設開啟。境內客戶報表頁無此警示文字與 專案交易 開關，不受影響。

#### Scenario: 選取子帳號明細顯示警示且停用 專案交易 開關
- **WHEN** 使用者於境外客戶報表頁的匯出對話框，將「客戶明細層級」切換為「子帳號明細」
- **THEN** 「客戶明細層級」區塊內顯示隱碼警示文字，「專案交易匯出」開關變為關閉且停用（無法點擊切換）

#### Scenario: 切回其他層級恢復 專案交易匯出
- **WHEN** 使用者從「子帳號明細」切回其他任一「客戶明細層級」選項
- **THEN** 隱碼警示文字隱藏，「專案交易匯出」開關恢復可操作，並還原為預設開啟

### Requirement: 匯出對話框新增 專案交易匯出開關
境外客戶報表頁的 `fb-export-dialog` MUST 在「彙總計算」區塊之後新增一個獨立的「專案交易匯出」開關區塊（說明文案：「包含並獨立呈現 專案交易 交易數據列，總計列下方，保留一列獨立的 專案交易 交易彙總數據。」），預設為開啟；此區塊 MUST NOT 出現在境內客戶報表頁的匯出對話框。「非1號開始」簡化模式生效時，此開關 MUST 維持可操作、不隨「報表時間維度」「統計比較指標」一併停用。匯出時，若此開關為開啟狀態，匯出事件的內容 MUST 包含對應旗標；境內頁匯出事件 MUST NOT 包含此欄位。

#### Scenario: 境外頁預設顯示 專案交易匯出且預設開啟
- **WHEN** 使用者於境外客戶報表頁開啟「匯出報表」對話框
- **THEN** 對話框底部（彙總計算之後）顯示「專案交易匯出」開關區塊，且預設為開啟狀態

#### Scenario: 關閉 專案交易匯出後再匯出
- **WHEN** 使用者將「專案交易匯出」開關切換為關閉，並點擊「匯出 Export」
- **THEN** 匯出事件內容中的 專案交易匯出旗標為關閉

#### Scenario: 境內頁不受影響
- **WHEN** 使用者於境內客戶報表頁開啟「匯出報表」對話框
- **THEN** 對話框不包含「專案交易匯出」區塊，匯出事件內容也不包含相關欄位

### Requirement: 匯出對話框佔比提示文案依頁面而異
當「績效指標」為佔比時，匯出對話框「月化」統計比較指標選項 MUST 停用並顯示提示文字；境外客戶報表頁的提示文字 MUST 為「佔比全月推算無實質業務意義」，境內客戶報表頁維持既有「佔比全月結算無實質買業務意義」。

#### Scenario: 境外頁佔比提示文案
- **WHEN** 使用者於境外客戶報表頁以「績效指標＝佔比」開啟匯出對話框
- **THEN** 「月化」選項停用，hover 顯示提示文字「佔比全月推算無實質業務意義」

### Requirement: 組織樹狀複選下拉元件 `fb-org-tree-select`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-org-tree-select`,實作 的組織樹狀複選下拉,供多個頁面的「資料管轄範圍」類欄位沿用。元件 MUST 以 light DOM、傳統 script 實作,樹狀資料與已選值透過 HTML 屬性或開啟時傳入的設定控制,節點展開/收合、父子連動與 indeterminate 行為與既有 `fb-perm-tree`（角色管理權限樹）一致。

元件收合狀態 SHALL 顯示一個觸發區塊:未選取時顯示 placeholder 文字（如「請選擇 (可多選)」）;已選取時以純文字、逗號分隔呈現目前已選取節點的最小階層（葉節點）名稱,不以標籤（tag）呈現;選取整個父節點（部門）時 SHALL 展開為其下所有子節點名稱,而非顯示父節點名稱;文字內容超出欄位寬度時 SHALL 以省略符號（...）截斷（`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`）。

點擊觸發區塊 SHALL 展開下拉面板,面板 SHALL 包含:

- 頂部關鍵字搜尋框,輸入時即時過濾節點（僅顯示名稱相符節點及其必要的父節點路徑）。
- 「全選」核取方塊與「顯示已選取」切換開關（並列同一列）。
- 可展開/收合的樹狀節點清單,每個節點前有核取方塊;父節點的子節點部分勾選時,父節點核取方塊 SHALL 呈現 indeterminate 樣式;直接勾選/取消父節點 SHALL 連動其所有子節點;不同階層的節點 SHALL 以縮排呈現明顯的階層差異,子層文字 SHALL 明顯落於父層文字右側。

面板展開時 SHALL 以 `position: fixed` 定位並移至 `<body>`,不受任何祖先容器（如 Modal 的 `overflow` 裁切）影響,不需捲動即可完整看到選單。面板內任何點擊操作（勾選、搜尋、全選、顯示已選取、展開/收合）SHALL NOT 導致選單意外收合。點擊面板外部或按 Esc SHALL 收合面板並保留目前已選取狀態,且 SHALL 僅收合本選單,不得連動關閉其所在的 Modal。所有色彩、字級、行高、圓角、間距 MUST 以 `var(--…)` token 取用,不得硬編色值。

#### Scenario: 收合狀態顯示已選節點文字

- **WHEN** 元件已選取節點且面板收合
- **THEN** 觸發區塊以逗號分隔的純文字顯示已選取節點的最小階層名稱,不顯示標籤;若文字寬度超出欄位,以「...」截斷

#### Scenario: 選取整個部門展開為子層名稱

- **WHEN** 使用者勾選某父節點使其下全部子節點皆選取
- **THEN** 觸發區塊與任何顯示此選取結果之處,顯示該父節點下所有子節點名稱,而非父節點自身名稱

#### Scenario: 展開與收合面板

- **WHEN** 使用者點擊觸發區塊
- **THEN** 下拉面板展開,顯示搜尋框、全選、顯示已選取開關與樹狀節點清單,面板 SHALL 完整可見,不因祖先容器的捲動或裁切而需要額外捲動

#### Scenario: 面板內點擊不導致收合

- **WHEN** 面板展開時,使用者點擊面板內任一元素（勾選節點、輸入搜尋關鍵字、點擊全選或顯示已選取開關、展開或收合節點）
- **THEN** 面板持續維持展開狀態,不會意外收合

#### Scenario: 點擊外部收合且不關閉所在 Modal

- **WHEN** 面板展開時使用者點擊元件以外的區域,或按下 Esc
- **THEN** 面板收合,目前已選取狀態不變;若元件位於 Modal 內,該 Modal SHALL NOT 一併關閉

#### Scenario: 父子節點連動與 indeterminate

- **WHEN** 使用者勾選或取消某父節點下部分子節點
- **THEN** 父節點核取方塊呈現 indeterminate 樣式;全部子節點勾選時父節點呈現全選樣式,全部取消時父節點呈現未選樣式;直接勾選或取消父節點會連動其所有子節點

#### Scenario: 階層縮排差異

- **WHEN** 面板展開顯示樹狀節點清單
- **THEN** 子層（第二層）節點的文字起始位置 SHALL 明顯落於父層節點文字右側,呈現可辨識的階層縮排差異

#### Scenario: 關鍵字搜尋過濾

- **WHEN** 使用者於搜尋框輸入關鍵字
- **THEN** 樹狀清單僅顯示名稱包含該關鍵字的節點,以及為呈現該節點所需顯示的父節點

#### Scenario: 全選與顯示已選取

- **WHEN** 使用者勾選「全選」
- **THEN** 所有節點皆為勾選狀態
- **WHEN** 使用者開啟「顯示已選取」開關
- **THEN** 樹狀清單僅顯示目前已勾選（含其 indeterminate 父節點路徑）的節點

### Requirement: 圖示切換按鈕元件 `fb-icon-toggle`

系統 SHALL 提供可復用的 `fb-` 前綴 Custom Element `fb-icon-toggle`，用於「單一圖示、兩態切換（開／關）」的按鈕情境（首個使用點為首頁行事曆的「追蹤 F/U」星號按鈕）。元件 MUST 以 light DOM、傳統 script 實作於 `assets/js/components.js`，MUST NOT 使用 ES module 語法或 `fetch`，色值僅能使用 `var(--…)` token。

元件 SHALL 透過 HTML 屬性或 property 控制以下內容：

- 兩態各自的圖示名稱（對應 `assets/js/icons.js` registry 的 `<fb-icon name="…">`），例如未選取時為空心星星、選取時為實心星星。
- 目前是否為選取（`on`）狀態，SHALL 提供 getter/setter。

使用者點擊元件時 SHALL 切換選取狀態（`on` ↔ 未選取），並對外派發變更事件，事件 payload SHALL 帶出切換後的布林值。元件本身 MUST NOT 內建任何網路請求或後端串接；狀態變更是否持久化由呼叫端決定。

#### Scenario: 預設未選取狀態顯示空心圖示

- **WHEN** 頁面以 `<fb-icon-toggle>` 且未設定選取狀態渲染
- **THEN** 元件顯示未選取態圖示（例如空心星星）

#### Scenario: 點擊切換為選取狀態

- **WHEN** 使用者點擊處於未選取狀態的 `fb-icon-toggle`
- **THEN** 元件切換為選取狀態圖示（例如實心星星），並派發變更事件、payload 為 `true`

#### Scenario: 再次點擊切回未選取狀態

- **GIVEN** `fb-icon-toggle` 目前為選取狀態
- **WHEN** 使用者再次點擊
- **THEN** 元件切回未選取狀態圖示，並派發變更事件、payload 為 `false`

#### Scenario: 單處修改全站生效

- **WHEN** 修改 `components.js` 中 `fb-icon-toggle` 的標記或行為
- **THEN** 所有使用該元件的頁面（含首頁行事曆）在重新載入後皆反映變更，無需逐頁修改

### Requirement: `fb-icon-toggle` 的 Figma 可追溯與 kitchen sink 覆蓋

新增 `fb-icon-toggle` 元件 MUST 於 `design/components.md` 新增條目，記錄元件名稱、對應 Figma node id（至少含）、兩態圖示與使用到的 token；並 MUST 於 `pages/_components.html` 加入可與 Figma 逐一比對的實例，涵蓋未選取與選取兩態。

#### Scenario: 文件與驗收頁同步

- **WHEN** `fb-icon-toggle` 被加入元件庫
- **THEN** `design/components.md` 出現對應條目且含至少一個 Figma node id，`pages/_components.html` 出現涵蓋未選取／選取兩態的實例

### Requirement: `fb-card-tabs` 支援分頁籤數字徽章

`fb-card-tabs` 元件 SHALL 支援每個分頁項目透過資料（JSON 設定中的 `badge` 欄位，數值或可轉為數字之字串）顯示紅底數字徽章於分頁文字右上角 的「服務通知 ❷」樣式。未設定 `badge` 或其值為 0／空值時 MUST NOT 顯示徽章。呼叫端 SHALL 可在資料變動後更新徽章數值，元件須反映最新數字，MUST NOT 需要整頁重新渲染以外的額外步驟。

色值僅能使用 `var(--…)` token，元件 MUST 以 light DOM、傳統 script 實作於 `assets/js/components.js`，MUST NOT 使用 ES module 語法或 `fetch`。

#### Scenario: 設定徽章數字時顯示

- **WHEN** `fb-card-tabs` 的分頁 JSON 設定中某一項帶有 `badge: 2`
- **THEN** 該分頁文字旁顯示紅底徽章「2」

#### Scenario: 未設定或為 0 時不顯示

- **WHEN** 分頁項目未帶 `badge` 欄位，或 `badge` 為 `0`
- **THEN** 該分頁不顯示徽章

#### Scenario: 徽章隨資料更新

- **WHEN** 呼叫端更新該分頁項目的 `badge` 數值並重新渲染 `fb-card-tabs`
- **THEN** 徽章顯示為更新後的數字

### Requirement: 異動標籤樣式 `chip--changed`

系統 SHALL 提供可復用的紅色「異動」標籤樣式（CSS class，例如 `chip--changed`），用於表格欄位中標示單一異動類型文字（例如「時間異動」「講師異動」） 的「類型」欄樣式。色值僅能使用 `var(--…)` token，MUST NOT 為單一頁面另外客製一份専屬樣式或內嵌色碼。

#### Scenario: 套用異動標籤樣式

- **WHEN** 表格欄位以異動標籤樣式呈現文字「時間異動」或「講師異動」
- **THEN** 呈現紅底文字的標籤樣式，與 Figma 設計稿一致

#### Scenario: 單處修改全站生效

- **WHEN** 修改 `components.css` 中異動標籤樣式的色值或間距
- **THEN** 所有使用該樣式的頁面（含首頁服務通知分頁）在重新載入後皆反映變更，無需逐頁修改

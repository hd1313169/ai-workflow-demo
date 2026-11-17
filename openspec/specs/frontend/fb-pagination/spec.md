## Purpose

定義 `fb-pagination` 分頁列 Custom Element 的可觀察行為：資訊列（顯示第 X 到 Y 筆／共 T 筆）、頁碼按鈕與前後箭頭與省略號、每頁筆數下拉、取值與設定介面，以及 `page-change` 事件，供有大量列的表格頁重用。

## Requirements

### Requirement: 結構與初始化

`fb-pagination` SHALL 依序顯示三個部分並整體靠右對齊（`justify-content: flex-end`，區塊間距 16px）：資訊列文字、頁碼區、「每頁顯示 N 筆」下拉。頁碼區的按鈕 SHALL 相互緊貼成一組（高 40px、外框相連、僅最外側圓角），前一頁／下一頁只顯示箭頭圖示。元件 SHALL 接受 `total`（總筆數）、`page`（目前頁碼，1 起算）、`page-size`（每頁筆數）作為屬性或內嵌 JSON；未提供時 `page` 預設為 1、`page-size` 取下拉的第一個選項。

#### Scenario: 以屬性初始化

- **WHEN** 元件被賦予 `total`、`page`、`page-size`
- **THEN** 資訊列顯示「顯示第 (page-1)*page-size+1 到 min(page*page-size, total) 筆，共 total 筆資料」，頁碼區反白目前頁，下拉顯示目前每頁筆數

#### Scenario: 未提供 page 與 page-size

- **WHEN** 元件只被賦予 `total`
- **THEN** 以 page=1 與下拉第一個選項為每頁筆數計算並呈現

### Requirement: 頁數計算

頁碼區顯示的總頁數 SHALL 為 `ceil(total / page-size)`。當總頁數為 0 或 1 時，頁碼區 SHALL 只顯示第 1 頁且前後箭頭為 disabled。

#### Scenario: 資料不足一頁

- **WHEN** `total` 小於或等於 `page-size`
- **THEN** 頁碼區只顯示「1」，且上一頁、下一頁箭頭皆為 disabled

#### Scenario: 多頁

- **WHEN** `total` 為 `page-size` 的 2.5 倍
- **THEN** 頁碼區可導向到第 3 頁（最後一頁），且該頁資訊列的結束筆數等於 `total`

### Requirement: 頁碼區與省略號

頁碼區 SHALL 提供「上一頁」「下一頁」箭頭與頁碼按鈕；當總頁數過多時 SHALL 以省略號（`fb-more-horizontal` 圖示，置於同樣式的方框內）折疊中間頁碼，並確保第一頁、最後一頁與目前頁附近的頁碼可見。目前頁的按鈕 SHALL 呈現選取樣式（主色外框＋主色文字，非填色底）且點擊不觸發事件。在第一頁時「上一頁」為 disabled；在最後一頁時「下一頁」為 disabled。

#### Scenario: 折疊中間頁碼

- **WHEN** 總頁數大到無法一次列出
- **THEN** 頁碼區顯示第 1 頁、最後一頁、目前頁鄰近頁碼，其餘以「…」折疊

#### Scenario: 邊界箭頭停用

- **WHEN** 目前在第一頁
- **THEN** 「上一頁」箭頭為 disabled；切到最後一頁時「下一頁」箭頭為 disabled

### Requirement: 換頁與每頁筆數變更事件

當使用者點擊可用的頁碼、前後箭頭，或改變「每頁顯示 N 筆」下拉時，`fb-pagination` SHALL 更新內部狀態並派發 `page-change` 事件，detail 帶目前 `page` 與 `pageSize`。變更每頁筆數時 SHALL 將 `page` 重置為 1。

#### Scenario: 點擊頁碼

- **WHEN** 使用者點擊第 2 頁
- **THEN** 元件反白第 2 頁、資訊列更新，並派發 `page-change`，detail 為 `{ page: 2, pageSize }`

#### Scenario: 變更每頁筆數

- **WHEN** 使用者將下拉由 20 改為 50
- **THEN** `page` 重置為 1，資訊列與頁碼區依新每頁筆數重算，並派發 `page-change`，detail 為 `{ page: 1, pageSize: 50 }`

### Requirement: 取值與設定介面

`fb-pagination` SHALL 提供讀取目前 `page` 與 `pageSize` 的介面，以及在資料變動時由呼叫端設定 `total`（並可一併設定 `page`）的方法；設定後 SHALL 重新渲染而不派發 `page-change`。

#### Scenario: 呼叫端更新總筆數

- **WHEN** 清單經篩選後由呼叫端設定新的 `total`
- **THEN** 元件依新 `total` 重算頁數與資訊列並重新渲染，不派發 `page-change`

#### Scenario: 讀取目前狀態

- **WHEN** 呼叫端讀取元件的 `page` 與 `pageSize`
- **THEN** 回傳目前頁碼與每頁筆數

### Requirement: 樣式僅引用 token

`fb-pagination` 的樣式 SHALL 只使用設計系統 token（顏色、間距、圓角、字級），不得出現硬編色值，以通過 `npm run lint:tokens`。

#### Scenario: token 檢查

- **WHEN** 執行 `npm run lint:tokens`
- **THEN** `fb-pagination` 相關 CSS 不產生任何硬編色值違規

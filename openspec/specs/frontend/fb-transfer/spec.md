## Purpose

定義 `fb-transfer` 雙欄穿梭清單 Custom Element 的可觀察行為：左右欄標題與搜尋、項目在兩欄間移動、取值介面與變更事件，供需要「未選 ↔ 已選」清單指派的表單重用。

## Requirements

### Requirement: 雙欄結構與初始化

`fb-transfer` SHALL 顯示左右兩欄清單，每欄有標題與搜尋框，項目來源與初始分配由屬性或內嵌 JSON 提供。

#### Scenario: 以資料初始化

- **WHEN** 元件被賦予項目清單與初始「已選」集合
- **THEN** 已選項目顯示在右欄，其餘顯示在左欄，兩欄標題文字為設定值（預設「未管轄組織」／「管轄組織」）

#### Scenario: 空欄呈現

- **WHEN** 某一欄沒有項目
- **THEN** 該欄顯示空狀態且不影響另一欄操作

### Requirement: 搜尋過濾

每欄搜尋框 SHALL 即時過濾該欄顯示的項目，僅影響顯示、不改變選取或分配。

#### Scenario: 輸入關鍵字

- **WHEN** 使用者在某欄搜尋框輸入文字
- **THEN** 該欄只顯示標籤包含關鍵字的項目；清空搜尋框後恢復完整清單

### Requirement: 項目移動

`fb-transfer` SHALL 允許使用者將項目在左右欄之間移動（單筆與整批）。

#### Scenario: 移動單筆

- **WHEN** 使用者對左欄某項目觸發移動
- **THEN** 該項目從左欄移除並出現在右欄，反向亦然

#### Scenario: 移動全部（可見）

- **WHEN** 使用者觸發某欄的「全部移動」
- **THEN** 該欄目前通過搜尋過濾而可見的項目全部移到另一欄

### Requirement: 取值與事件

`fb-transfer` SHALL 提供讀取目前右欄（已選）項目的介面，並在分配變動時派發 `transfer-change` 事件。

#### Scenario: 讀取已選

- **WHEN** 呼叫端讀取元件的 value
- **THEN** 回傳目前右欄所有項目的識別值清單

#### Scenario: 變更事件

- **WHEN** 任一項目在左右欄之間移動
- **THEN** 元件派發 `transfer-change` 事件，detail 帶目前已選清單

### Requirement: 樣式僅引用 token

`fb-transfer` 的樣式 SHALL 只使用設計系統 token（顏色、間距、圓角、字級），不得出現硬編色值，以通過 `npm run lint:tokens`。

#### Scenario: token 檢查

- **WHEN** 執行 `npm run lint:tokens`
- **THEN** `fb-transfer` 相關 CSS 不產生任何硬編色值違規

# component-showcase Specification

## Purpose
提供可公開瀏覽的互動式元件展示網站（Storybook），讓訪客在數分鐘內理解設計系統如何從 design token 出發，組成可重用元件與 UI patterns，再組裝成完整頁面；並在發佈前自動把關識別資訊。

## Requirements

### Requirement: 首頁導覽
展示網站開啟時 SHALL 先顯示 Introduction 頁，說明專案背景、作者角色與「token → 元件 → 頁面」架構。

#### Scenario: 開啟網址
- **WHEN** 訪客開啟展示網站根網址
- **THEN** 畫面顯示 Introduction 頁，側欄依序列出 Introduction、Foundations、Components、Patterns、Pages

### Requirement: Foundations 與 token 同步
Foundations 頁 SHALL 顯示色彩、字級、間距，數值 SHALL 來自專案 design token，而非手抄。

#### Scenario: token 變更後重建
- **WHEN** 修改 token 並重新建置
- **THEN** Foundations 頁顯示新值

### Requirement: 元件互動展示
每個收錄元件 SHALL 有預設範例、主要狀態變體，以及可即時調整屬性的控制項；元件 SHALL 使用與正式頁面相同的程式與樣式。

#### Scenario: 調整屬性
- **WHEN** 訪客在控制面板變更元件屬性
- **THEN** 預覽中的元件立即反映變更

#### Scenario: 需觸發的元件
- **WHEN** 訪客檢視對話框或 toast 類元件
- **THEN** 頁面提供觸發按鈕可開啟並關閉該元件

### Requirement: UI patterns 展示
Patterns 區 SHALL 展示可重複使用的元件組合，每個 pattern SHALL 註明其組成元件與使用於哪些頁面。

#### Scenario: 檢視 pattern
- **WHEN** 訪客開啟 Patterns 下任一項目
- **THEN** 顯示可互動的組合範例，並列出組成元件與使用頁面

### Requirement: 完整頁面收錄
Pages 區 SHALL 收錄專案所有對外頁面（底線開頭的內部頁除外），並依業務分類分組；頁面間的導覽連結 SHALL 可在展示網站內正常切換。

#### Scenario: 檢視頁面
- **WHEN** 訪客開啟 Pages 下任一頁面
- **THEN** 顯示可互動的完整頁面，主控台無錯誤

#### Scenario: 頁內導覽
- **WHEN** 訪客在嵌入頁面中點擊頂部導覽連結
- **THEN** 嵌入區切換至對應頁面而非出現找不到頁面

### Requirement: 易讀的屬性與 token 呈現
元件屬性表 SHALL 為每個屬性提供說明、預設值與分組；Foundations SHALL 以視覺為主的版面呈現 token（色票卡片、比例尺、字樣），並顯示色彩的實際色碼。

#### Scenario: 閱讀屬性表
- **WHEN** 訪客開啟元件 Docs 頁
- **THEN** 每個屬性皆有說明與預設值，並依內容／狀態／事件分組

#### Scenario: 閱讀色彩
- **WHEN** 訪客開啟 Foundations/Colors
- **THEN** 色票以卡片呈現，顯示 token 名稱、參照與實際色碼

### Requirement: 發佈前識別資訊把關
自動部署流程 SHALL 在發佈前對建置產物執行識別資訊檢查，檢查失敗時 SHALL NOT 發佈。

#### Scenario: 產物含禁用詞
- **WHEN** 建置產物命中禁用詞
- **THEN** 部署中止，線上版本維持不變

#### Scenario: 產物乾淨
- **WHEN** 檢查通過
- **THEN** 新版本發佈至 GitHub Pages 並可公開瀏覽

### Requirement: 元件全收錄
展示網站 SHALL 收錄專案註冊的所有 `fb-*` 元件；每個元件 SHALL 有可互動範例與完整屬性表（說明、預設值、分組）。

#### Scenario: 比對元件清單
- **WHEN** 比對元件程式註冊的元件名稱與展示網站的 Components 區
- **THEN** 每個註冊的元件皆有對應項目

#### Scenario: 需觸發的元件
- **WHEN** 訪客檢視對話框類元件
- **THEN** 頁面提供觸發按鈕，開啟後可關閉，並顯示事件結果

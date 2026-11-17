# Design

## Context

見 proposal.md - Why。元件為原生 Custom Elements（`fb-*`，註冊於 `assets/js/components.js`，圖示於 `icons.js`），樣式為 `tokens.css` + `base.css` + `components.css`。多數元件只在連線時讀取屬性，未監聽屬性變更。

## Goals / Non-Goals

**Goals:**
- 面試官 3~5 分鐘內看完主線；線上網址穩定可用。

**Non-Goals:**
- 不改寫元件、不補 `observedAttributes`；不做視覺回歸或互動測試；不做離線版。

## Decisions

**1. 框架用 `@storybook/web-components-vite`，置於 `storybook/` 子專案。**
元件本身是 Web Components，可零改寫直接渲染。*替代*：React 包裝 → 多一層無意義轉換，捨棄。放子專案以保住根目錄零相依與既有 `build.mjs` 交付流程。

**2. 以 `preview-head.html` 載入根目錄 `assets/` 的 CSS 與 JS（`staticDirs` 帶進產物）。**
元件為傳統 script（全域註冊），與正式頁面載入方式相同；單一來源，元件改動自動反映。

**3. 每個 story 以 render 函式回傳新元素，控制項變更即重建元件。**
繞過元件未監聽屬性變更的限制，不需修改元件。

**4. Foundations 以 story 讀取 `design/tokens.json` 產生色票與字級表。**
符合「不手抄 token」的要求。

**5. 精選元件：** Chip、Toggle、StatusPill、Segmented、Pagination、Dropdown、DateField、Modal、Toast、Transfer。
挑選標準：涵蓋原子、表單、浮層、複合四類，且都有明顯狀態變化。

**5a. Patterns 與 Pages 分區。**
Patterns 只放「可重複使用的組合」：篩選區、表單對話框、刪除確認與回饋、管轄範圍設定；每個 pattern 的說明列出組成元件與使用頁面。Pages 依業務分類（首頁、報表、權限管理、稽核）收錄全部 11 頁。
資料表格不列為 pattern：專案沒有共用表格元件，表格樣式寫在各頁 CSS，抽出會變成複製頁面樣式；改由 Pages 中的真實頁面展示。

**5b. 正式頁面置於產物的 `app/` 目錄。**
`staticDirs` 將 `index.html`、`pages/`、`assets/` 帶到 `app/` 下，保留原本的相對路徑，頁內導覽可在 iframe 中正常切換；也避免專案 `index.html` 與 Storybook 自己的 `index.html` 衝突。

**5c. 屬性表與 Foundations 的可讀性。**
屬性表沿用 Storybook 內建 ArgsTable，但每個 argType 補齊 description、`table.defaultValue`、`table.category`（內容／狀態／事件），事件以無控制項的列呈現。Foundations 不用表格：色彩為卡片牆（依色系分組、顯示以 getComputedStyle 解析出的實際色碼），間距為等比例尺，圓角為方塊，字級為字樣清單。

**6. 部署：GitHub Actions → `build-storybook` → `lint:brand storybook-static` → `actions/deploy-pages`。**
禁用詞清單由 repository Secret 寫入暫存檔供檢查使用。Storybook 產物皆為相對路徑，無須設定 Vite `base` 即可部署於 Pages 子路徑（已以 `/crm-inst/` 子路徑實測）。

**7. 主題：Storybook 介面套用專案品牌色與自訂標題 `crm-inst`。**

## Risks / Trade-offs

- [元件依賴全域頁面環境（例如 body 層浮層容器）] → 在 preview decorator 提供必要容器；逐一驗證浮層類元件。
- [頁面範例依賴頁面內聯腳本] → 以 iframe 或將頁面邏輯抽出載入；先做一頁驗證可行再擴充。
- [Secret 未設定導致誤放行] → `lint:brand` 找不到清單即失敗（見 public-showcase-hygiene）。
- [repo 可見性] → 依需求 repo 可公開；前提為前一個 change 已達零命中。

## Open Questions

- Introduction 的作者介紹文字與角色描述，由使用者實作時提供。

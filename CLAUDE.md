# ai-workflow-demo

公開的設計系統展示品：無框架 prototype（原生 Custom Elements `fb-*`、三層 design token），附 Storybook。內容已去識別化，任何新增文字與假資料都維持虛構。

## 開發頁面或元件

依序完成，每步達成完成條件才進下一步：

1. **盤點**：在 Storybook 找出需求會用到的元件與 pattern。
   來源：`storybook/stories/components/`（元件屬性、事件、方法在各檔 `argTypes`）、`storybook/stories/patterns/`（組合寫法與使用頁面）、`pages/*.html`（真實實作）。
   完成條件：需求中每個 UI 區塊都對應到一個既有 `fb-*` 元件、pattern 或 `components.css` 的 class，或明確標記為「缺元件」。
2. **缺元件時先提案**：以 `/opsx:propose` 新增元件，元件進 Storybook 並有完整 `argTypes` 後，才用在頁面上。頁面內只放組裝與頁面邏輯。
3. **實作**：組裝既有元件；顏色、字級、間距、圓角一律用 `var(--token)`，新值加進 `design/tokens.json` 後跑 `npm run build:tokens`（`assets/css/tokens.css` 是產物）。新頁面放 `pages/`，並在 `storybook/stories/pages/` 加一個 story。
4. **驗證**：在 `storybook/` 執行 `npm run shots -- <story id 片段>`，讀截圖確認畫面符合需求、`shots/report.txt` 為 OK。
   完成條件：每張相關截圖都看過、報告零錯誤。
5. **把關**：根目錄 `npm run check`（色值 + 識別資訊）通過。

## 守則

- **識別資訊**：`.brand-denylist.txt` 為禁用詞清單，只存在本機（gitignore），內容不寫進任何追蹤檔、commit 訊息或 log。`lint:brand` 失敗時改寫文字本身，維持虛構名稱（如「北辰科技」、`@example.com`）。
- **改了 `storybook/.storybook/main.js`**（例如 `staticDirs`）要重啟 `npm run storybook`；該檔只在啟動時讀取，`preview-head.html` 則會熱更新，兩者不同步時整站樣式 404。
- **規格流程**：功能變更走 OpenSpec（`/opsx:propose` → `/opsx:apply` → `/opsx:archive`）；規格在 `openspec/specs/`。

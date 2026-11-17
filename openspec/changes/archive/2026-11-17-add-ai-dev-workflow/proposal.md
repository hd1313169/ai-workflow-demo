# Proposal

## Why

接下來要以 AI coding 方式繼續開發頁面。AI 最常見的失誤是「不知道已有元件而自行重做」與「看不到畫面、無法自我驗證」。Storybook 已具備元件目錄與建置流程，但只收錄 10/28 個元件、沒有給 AI 的開發規則，畫面驗證也仰賴臨時手動指令（本次曾因此漏驗頁面、未察覺資源 404）。

## What Changes

- 新增專案根目錄 `CLAUDE.md`：規定 AI 開發頁面前先查 Storybook 元件與 patterns、只用既有 `fb-*` 元件與 token、缺元件時先停下提案、完成後執行截圖驗證與 lint。
- Storybook 補齊其餘元件 stories（含 `fb-icon` 圖示庫），每個元件具說明、預設值、分組的屬性表。
- 新增截圖驗證指令 `npm run shots`（storybook 子專案）：建置、啟動本機伺服器、逐一截圖所有 story，並輸出載入狀態、主控台錯誤、失敗資源的報告；可用篩選字串只截部分 story。

## Capabilities

### New Capabilities
- `visual-verification`: 以單一指令對展示網站全部或部分畫面截圖，並回報錯誤，供人與 AI 驗證畫面。

### Modified Capabilities
- `component-showcase`: 新增「元件全收錄」需求。

## Impact

- 新增：`CLAUDE.md`、`storybook/scripts/shots.mjs`、`storybook/stories/components/*`（約 19 檔）。
- 修改：`storybook/package.json`（新增指令）、`storybook/.gitignore`（忽略截圖輸出）、`README.md`。
- 無新增相依：截圖使用本機已安裝的 Edge／Chrome，經 Chrome DevTools Protocol 以 Node 內建 WebSocket 操作。

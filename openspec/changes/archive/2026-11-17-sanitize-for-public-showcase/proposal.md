# Proposal

## Why

此專案副本將公開於 GitHub Pages 作為面試作品展示。目前原始碼、假資料、設計對照檔與 OpenSpec 歷史中仍散落可回溯原客戶的識別資訊（品牌名、email 網域、業務術語、Figma 檔案位址），任何一處外洩都不可接受。先前的去識別化只涵蓋兩個報表頁的畫面，不足以支撐公開 repo。

## What Changes

- 專案改名為 `crm-inst`（`package.json` name / description、README 標題）。
- 全部頁面、元件程式碼與註解、design 文件中的品牌名、客戶企業名稱、email 網域改為虛構值（email 一律 `@example.com`）。
- 業務術語改為通用說法（沿用既有「境內／境外客戶」系列對照），以字串比對的程式邏輯成組替換，行為不變。
- 移除 Figma 檔案位址與 fileKey、`design/figma-export.json`，以及 CSS／JS／token 中的 Figma node ID 註解。
- **BREAKING（文件）** 刪除 `openspec/changes/archive/` 與所有已完成但未歸檔的 change；改寫 `openspec/specs/**` 與進行中 change 中的識別資訊。
- 刪除 `dist/` 與 `.mcp.json`；`.gitignore` 加入 `.claude/`、`dist/`、禁用詞清單檔。
- 新增 `npm run lint:brand`：依不進版控的禁用詞清單掃描檔案，命中即非零結束。

## Capabilities

### New Capabilities
- `public-showcase-hygiene`: 公開發佈內容不得含有可識別原客戶的資訊，並以自動化檢查把關。

### Modified Capabilities
（無：既有元件與頁面的行為不變，僅替換文字與資料。）

## Impact

- 檔案：`package.json`、`README.md`、`index.html`、`pages/*.html`、`assets/js/*.js`、`assets/css/*.css`、`design/*`、`openspec/**`、`build.mjs`、`.gitignore`。
- 無新增相依；根目錄維持零相依。
- 為後續 `add-storybook-showcase` 的前置條件。

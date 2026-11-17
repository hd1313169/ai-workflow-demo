# Proposal

## Why

面試時需要一個公開網址，讓面試官在幾分鐘內看懂此專案「design token → 元件 → 頁面」的設計系統做法。現有 `pages/_components.html` 是靜態 kitchen sink，無法互動調整屬性、缺少說明脈絡，也不適合當作品連結。

## What Changes

- 新增獨立子專案 `storybook/`（自有 `package.json`），以 Web Components 方式直接載入現有 `assets/`，元件不改寫；根目錄維持零相依。
- 新增導覽式內容：Introduction（專案背景、角色、架構圖）、Foundations（色彩／字級／間距，由 tokens 產生）、精選 10 個元件、Patterns（可重複使用的組合）、Pages（全部 11 頁依業務分類）。
- 屬性表與 Foundations 以易讀的視覺版面呈現。
- 每個元件 story 提供可調整屬性的控制面板與主要狀態變體。
- 以 GitHub Actions 建置並部署至 GitHub Pages；部署前對建置產物執行 `lint:brand`，命中即中止。

## Capabilities

### New Capabilities
- `component-showcase`: 對外展示元件庫的互動式文件網站，包含內容結構、元件互動展示與發佈把關。

### Modified Capabilities
（無）

## Impact

- 新增 `storybook/` 與 `.github/workflows/`；需要 Node 與 Storybook 相關 devDependencies（僅限子專案）。
- 依賴 `sanitize-for-public-showcase` 完成後才能部署。
- 不在範圍：離線本機開啟、全部 28 個元件覆蓋。

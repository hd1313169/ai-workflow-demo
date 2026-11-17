# Design

## Context

見 proposal.md - Why。Storybook 位於 `storybook/` 子專案，正式頁面與資產經 `staticDirs` 帶到產物 `app/`。本機有 Edge（Windows），無 Puppeteer／Playwright。

## Goals / Non-Goals

**Goals:**
- AI 新對話也能遵循同一套開發規則；截圖驗證一個指令完成。

**Non-Goals:**
- 不做視覺回歸（基準圖比對）；不放進 CI；不改元件本身。

## Decisions

**1. 規則放在 `CLAUDE.md`（專案根目錄）。**
Claude Code 每次對話自動載入。內容以「必做／禁止」條列，並指向 Storybook、patterns、lint 與截圖指令；不重複元件細節（以 Storybook 為準，避免兩處不同步）。

**2. 截圖以 Chrome DevTools Protocol 直接驅動瀏覽器，不引入相依。**
Node 24 內建 `WebSocket`／`fetch`。以 `--remote-debugging-port` 啟動 headless Edge／Chrome，對每個 story 開分頁、監聽 `Runtime.exceptionThrown`、`Runtime.consoleAPICalled(error)`、`Log.entryAdded(error)`、`Network.responseReceived(status>=400)`、`Network.loadingFailed`，載入後等待片刻再 `Page.captureScreenshot`。
*替代*：命令列 `--screenshot` → 無法取得主控台錯誤與 404，捨棄；Playwright → 新增大型相依與瀏覽器下載，捨棄。瀏覽器路徑自動偵測 Edge／Chrome，可用 `CHROME_PATH` 覆寫。

**3. 內建靜態伺服器，掛在 `/ai-workflow-demo/` 子路徑。**
以 Node `http` 實作，與 GitHub Pages 路徑結構一致。

**4. 指令介面。**
`npm run shots [-- <篩選字串>] [--no-build]`：預設先建置；截下所有 story 與 Docs 頁（Introduction 等）；輸出 `storybook/shots/<story-id>.png` 與 `report.txt`；有錯誤則非零結束。`shots/` 列入 gitignore。

**5. 元件 stories 分組沿用既有 Atoms／Forms／Overlays／Composite，另增 Navigation（導覽、分頁類）與 Data Display（統計卡、資訊表、圖示）。**
對話框類一律提供觸發按鈕與事件輸出列。

## Risks / Trade-offs

- [CDP 版本差異] → 只使用穩定的基本 domain（Page、Runtime、Network、Log、Target）。
- [非同步元件截圖過早] → 載入後固定等待（可調），對話框類 story 預設為關閉狀態，截到的是觸發按鈕。
- [程序殘留] → `try/finally` 與 `SIGINT` 處理一律關閉瀏覽器與伺服器。

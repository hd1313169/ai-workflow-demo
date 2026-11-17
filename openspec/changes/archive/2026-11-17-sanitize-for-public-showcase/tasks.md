# Tasks

## 1. 準備

- [x] 1.1 將整個資料夾壓縮備份到專案外，確認壓縮檔可開啟
- [x] 1.2 全庫掃描建立 `.brand-denylist.txt`（品牌、企業名、網域、術語、Figma 位址／fileKey，含英文與大小寫變形），確認清單涵蓋探索階段找到的全部類別
- [x] 1.3 建立 `.gitignore`，加入 `.brand-denylist.txt`、`.claude/`、`dist/`、`node_modules/`，確認規則存在

## 2. lint:brand

- [x] 2.1 在 `build.mjs` 新增 `lint` 的品牌檢查模式（可帶目錄參數、找不到清單時失敗），`package.json` 加入 `lint:brand`，確認目前執行會失敗並列出命中
- [x] 2.2 在 README 記錄 `lint:brand` 用法與清單檔位置（不寫清單內容），確認文件中無禁用詞

## 3. 程式與頁面

- [x] 3.1 替換 `assets/js/components.js`、`assets/css/components.css` 中的術語與註解（成組處理字串比對），開 `pages/_components.html` 確認元件正常
- [x] 3.2 替換 `index.html` 假資料與術語，瀏覽器開啟確認行事曆與客戶清單互動正常、主控台無錯誤
- [x] 3.3 替換 `pages/*.html` 全部頁面（email 改 `@example.com`、企業名、術語），逐頁開啟確認互動正常
- [x] 3.4 移除 CSS／JS／tokens 中 Figma node ID 註解，重跑 `npm run build:tokens` 與 `npm run lint:tokens` 確認通過

## 4. 文件與設定

- [x] 4.1 `package.json` 改名 `crm-inst` 並改寫 description，README 改寫標題與內容
- [x] 4.2 改寫 `design/components.md`（移除 Figma 位址與 node 欄），刪除 `design/figma-export.json`
- [x] 4.3 刪除 `openspec/changes/archive/` 以及 `openspec/changes/` 下所有已完成但未歸檔的 change（僅保留本 change 與 `add-storybook-showcase`），改寫 `openspec/specs/**` 與進行中 change 的識別資訊，執行 `openspec validate --all` 確認通過
- [x] 4.4 刪除 `dist/` 與 `.mcp.json`

## 5. 整合驗證

- [x] 5.1 執行 `npm run lint:brand` 掃描整個專案（排除 gitignore 項目），確認零命中
- [x] 5.2 人工瀏覽所有頁面（含下拉、tooltip、對話框、toast、分頁標題），確認畫面無識別資訊

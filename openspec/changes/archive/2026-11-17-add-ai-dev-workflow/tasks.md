# Tasks

## 1. 截圖驗證指令

- [x] 1.1 新增 `storybook/scripts/shots.mjs`（CDP 驅動、子路徑伺服器、錯誤收集、篩選、`--no-build`），`package.json` 加 `shots` 指令、`.gitignore` 忽略 `shots/`；執行後確認截圖數量與 story 數一致、報告產生、無殘留程序
- [x] 1.2 故意讓一個資源 404（暫時改壞 preview-head 路徑）確認報告列出並以非零結束，還原後確認通過

## 2. 補齊元件 stories

- [x] 2.1 Navigation：topnav、tabbar、card-tabs、side-tabs、area-title；以 `npm run shots -- components-navigation` 確認無錯誤
- [x] 2.2 Forms：time-field、datetime-field、org-tree-select、mini-calendar、icon-toggle；以篩選截圖確認
- [x] 2.3 Overlays：confirm-dialog、schedule-dialog、export-dialog、batch-export-dialog（觸發按鈕＋事件輸出）；以篩選截圖確認
- [x] 2.4 Data Display 與 Composite：stat-card、info-table、icon（圖示庫）、perm-tree、filter-card；以篩選截圖確認
- [x] 2.5 比對 `components.js` 註冊清單與 Components 區，確認全收錄；全部截圖報告零錯誤

## 3. AI 開發規則

- [x] 3.1 撰寫根目錄 `CLAUDE.md`（查 Storybook／patterns、只用 `fb-*` 與 token、缺元件先提案、完成後 shots + lint），確認所列指令皆可執行
- [x] 3.2 README 補上 `npm run shots` 用法與 `CLAUDE.md` 說明

## 4. 整合驗證

- [x] 4.1 `lint:tokens`、`lint:brand`（原始碼與產物）通過，`openspec validate --strict` 本 change 通過

# Tasks

前置：`sanitize-for-public-showcase` 全部完成，`npm run lint:brand` 零命中。

## 1. 建立子專案

- [x] 1.1 在 `storybook/` 初始化 web-components-vite 的 Storybook，確認 `npm run storybook` 可開啟預設頁
- [x] 1.2 在 preview 載入根目錄 `assets/` 的三支 CSS 與 `icons.js`、`components.js`，並加入浮層容器 decorator；以一個臨時 story 渲染 `<fb-chip>` 確認樣式正確
- [x] 1.3 套用自訂主題（標題 `crm-inst`、品牌色），移除範例 stories，確認側欄只剩專案內容

## 2. 內容主線

- [x] 2.1 撰寫 Introduction.mdx（背景、角色、架構圖），設為預設首頁，確認開啟根網址即顯示
- [x] 2.2 撰寫 Foundations（Colors、Typography、Spacing），由 `design/tokens.json` 產生，修改一個 token 後重建確認畫面跟著變

## 3. 元件 stories

- [ ] 3.1 原子類：Chip、Toggle、StatusPill、Segmented，含變體與控制項，確認調整控制項時預覽即時更新
- [ ] 3.2 表單類：Pagination、Dropdown、DateField，含假資料，確認互動正常、主控台無錯誤
- [ ] 3.3 浮層類：Modal、Toast，提供觸發按鈕，確認可開關且不殘留
- [ ] 3.4 複合類：Transfer，確認左右移動項目正常
- [x] 3.5 每個 story 補上元件用途與屬性說明（autodocs），確認 Docs 頁顯示說明

## 4. Patterns

- [ ] 4.1 FilterCard 組合範例，確認篩選互動正常
- [ ] 4.2 報表頁完整範例，確認展開收合、凍結欄、匯出對話框可用

## 7. 重整與可讀性

- [x] 7.1 將 `index.html`、`pages/`、`assets/` 改由 `staticDirs` 帶到產物 `app/` 下，preview 改載入 `app/assets`，建置後確認元件樣式與頁面 iframe 皆正常
- [ ] 7.2 Pages 區依業務分類收錄全部 11 頁，截圖確認每頁正常渲染、主控台無錯誤
- [x] 7.3 Patterns 區改為四個組合（篩選區、表單對話框、刪除確認與回饋、管轄範圍設定），每個註明組成元件與使用頁面，截圖確認渲染
- [x] 7.4 全部元件 argTypes 補齊說明、預設值、分組，事件列入「事件」組，截圖確認 Docs 屬性表
- [x] 7.5 Foundations 改為色票卡片牆（含實際色碼）、間距比例尺、圓角方塊、字樣清單，截圖確認版面

## 5. 部署

- [x] 5.1 確認產物可部署於 Pages 子路徑，本機 `build-storybook` 後以靜態伺服器開啟確認資源路徑正確
- [x] 5.2 新增 GitHub Actions workflow（build → `lint:brand` 掃描產物 → deploy-pages），README 記錄需設定的 Secret 名稱
- [ ] 5.3 故意在產物中放入一個禁用詞測試，確認 workflow 中止且不部署；移除後確認成功部署

## 6. 整合驗證

- [ ] 6.1 以無痕視窗開啟公開網址走完整主線（Introduction → Foundations → Components → Patterns），確認全部正常、無識別資訊

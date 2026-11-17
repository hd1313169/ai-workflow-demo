# ai-workflow-demo — CRM 企業客戶報表前端 prototype

無框架、無建置相依的互動式前端雛形。共用元件以原生 Custom Elements（`fb-*`）實作，
所有色彩／字級／間距集中於 design token。規範見
[`openspec/specs/frontend-component-system`](openspec/specs/frontend-component-system/spec.md)。

## 目錄

```
index.html                 首頁 個人行事曆（組裝檔）
pages/domestic_basic_report.html  境內客戶報表（組裝檔）
pages/foreign_basic_report.html   境外客戶報表（組裝檔）
pages/_components.html      元件 kitchen sink
assets/css/tokens.css       由 design/tokens.json 產生（勿手改）
assets/css/base.css         reset / 版面
assets/css/components.css   所有共用元件樣式
assets/js/icons.js          圖示 registry + <fb-icon>
assets/js/components.js     所有 fb-* 元件
design/tokens.json          token 唯一來源
design/components.md         元件規格（屬性、變體、狀態）
build.mjs                   建置腳本（純 Node，無相依）
```

## 指令

```bash
npm run build:tokens   # design/tokens.json -> assets/css/tokens.css
npm run lint:tokens    # 掃描 tokens.css 以外的硬編色值（CI 應執行）
npm run lint:brand     # 依禁用詞清單掃描識別資訊（公開發佈前必須 OK）
npm run build          # 內嵌 assets -> dist/<page>.html（單一自足檔，可 file:// 雙擊開啟）
```

## Storybook 元件展示

獨立子專案 `storybook/`（自有相依，根目錄維持零相依），直接載入上層 `assets/` 的 CSS 與 JS，不重寫元件。

```bash
cd storybook
npm install
npm run storybook         # 開發 http://localhost:6006
npm run build-storybook   # 產出 storybook/storybook-static/
npm run lint:brand        # 掃描建置產物的識別資訊
npm run shots             # 截圖驗證（見下節）
```

- 內容：`stories/Introduction.mdx`、`stories/foundations/`（讀 `design/tokens.json`）、
  `stories/components/`（全部 29 個 `fb-*` 元件）、`stories/patterns/`（可重複使用的組合）、
  `stories/pages/`（全部頁面，依業務分類）。
- 頁面以 iframe 嵌入，正式檔案經 `staticDirs` 帶到產物的 `app/` 下。
- 改了 `.storybook/main.js` 要重啟 `npm run storybook`（該檔只在啟動時讀取）。

### 截圖驗證（npm run shots）

建置後以本機 Edge／Chrome 逐一截下每個 story，並收集主控台錯誤、例外與載入失敗的資源。

```bash
npm run shots                    # 全部
npm run shots -- pages-          # 只截 id 含「pages-」的 story
npm run shots -- --no-build      # 沿用既有建置
npm run shots -- --wait=2500     # 加長每個畫面的等待時間（預設 1200ms）
```

- 輸出：`storybook/shots/<story-id>.png` 與 `shots/report.txt`（不進版控）。
- 任一畫面有錯誤時以非零狀態結束；在與 GitHub Pages 相同的子路徑下載入。
- 找不到瀏覽器時以環境變數 `CHROME_PATH` 指定。不需安裝額外套件。

## AI 開發規則（CLAUDE.md）

根目錄 `CLAUDE.md` 規定 AI 開發頁面時的流程：先在 Storybook 盤點元件與 pattern、
缺元件先提案、只用 token、完成後以 `npm run shots` 讀截圖驗證、`npm run check` 把關。
Claude Code 每次對話會自動載入。
- 產物皆為相對路徑，可直接部署於 GitHub Pages 子路徑（`https://<帳號>.github.io/<repo>/`）。

### 部署（GitHub Actions）

`.github/workflows/storybook-pages.yml`：push 到 `main` 時執行
「原始碼 lint:brand → lint:tokens → build-storybook → 產物 lint:brand → 部署 Pages」，任一檢查失敗即不部署。

首次設定：

1. Repository → Settings → Pages → Source 選 **GitHub Actions**。
2. Repository → Settings → Secrets and variables → Actions → 新增 secret **`BRAND_DENYLIST`**，
   內容貼上本機 `.brand-denylist.txt` 全文。未設定時 workflow 會直接失敗。

## 識別資訊檢查（lint:brand）

本專案公開展示前，必須確認不含任何可識別原客戶的資訊。

- 禁用詞清單放在專案根目錄的 `.brand-denylist.txt`，**已列入 `.gitignore`，不可提交**；
  CI 以環境變數 `BRAND_DENYLIST_FILE` 指向由 Secret 寫出的暫存檔。
- 格式：一行一詞、`#` 開頭為註解；一般詞為不分大小寫子字串比對，`re:` 開頭為正規式。
- `node build.mjs lint-brand [目錄]` 可指定掃描目錄（例如建置產物），預設掃描整個專案。
- 找不到清單或清單為空一律失敗；命中時只輸出檔案、行號與規則序號，不回印命中內容。

開發時用 Live Server 開 `index.html`；測試站部署 `index.html` + `pages/` + `assets/`；
要給客戶本機開啟時交付 `dist/` 內對應單檔（見下節）。

## 交付客戶本機單檔

客戶端可能沒有伺服器、只會用瀏覽器**雙擊開啟 `.html`**。此情境不能直接給 `index.html`
（它用相對路徑載入 `assets/`，缺資料夾就壞），要給 `npm run build` 產出的**單一自足檔**。

### 步驟

1. 確認在最新狀態：
   ```bash
   npm run build:tokens   # 若剛改過 design/tokens.json
   npm run lint:tokens    # 必須 OK，零違規
   ```
2. 打包：
   ```bash
   npm run build
   ```
3. 產物在 `dist/`：
   - `dist/index.html` ── 首頁 個人行事曆
   - `dist/domestic_basic_report.html` ── 境內客戶報表
   - `dist/foreign_basic_report.html` ── 境外客戶報表
   - `dist/<頁名>.html` ── `pages/` 內每個**非 `_` 開頭**的頁面各一個
     （`pages/_components.html` 這類底線開頭的不會被打包）
4. 交付：把**對應的那一個** `dist/*.html` 傳給客戶即可。
   - 不需要、也不要一起給 `assets/`、`design/`、`node_modules/`、`dist/` 其他檔。
   - 檔案已內嵌三支 CSS + `icons.js` + `components.js`，無任何外部相依。

### 驗證（交付前必做）

- 用**檔案總管**進到 `dist/`，直接雙擊要交付的那一個 `.html`（網址列會是 `file:///...`）。
- 確認：版面與互動正常，且瀏覽器主控台（F12）沒有紅字錯誤。
  - 首頁 `index.html`：行事曆換月／選日、分類 chip 篩選、新增行程 Modal（計時／全天、備註 0/100）。
  - `domestic_basic_report.html`：下拉選單、日期月曆、年度展開／收合、排序、客戶群明細分頁。
  - `foreign_basic_report.html`：同上，另需確認「產業類別」= 外資 路徑多一層「境外分類」可展開/收合、匯出對話框「彙總層級」含「境外分類彙總」選項。
- 建議用客戶實際會用的瀏覽器再測一次。

### 給 AI 的指令範本

```
執行 npm run build，把 dist/index.html 交給客戶（單一檔、可本機雙擊開啟）。
先跑 npm run lint:tokens 確認 OK。不要交付 assets/ 或 dist/ 以外的檔。
若我另外指定頁面，改交付 dist/<該頁名>.html。交付前雙擊該檔用 file:// 開啟驗證一次。
```

### 注意

- `dist/` 已列入 `.gitignore`，是每次重新產生的產物，不進版控。
- 改了 `assets/**` 或 `design/tokens.json` 後，一定要重跑 `npm run build` 才會反映到 `dist/`。
- 若要壓縮（minify）再交付，目前腳本未做；有需求再加。

## 新增一個頁面

1. 在 `pages/` 建立 `你的頁面.html`。
2. `<head>` **只**連結共用資產（相對路徑），不要自己寫元件樣式：
   ```html
   <link rel="stylesheet" href="../assets/css/tokens.css">
   <link rel="stylesheet" href="../assets/css/base.css">
   <link rel="stylesheet" href="../assets/css/components.css">
   ```
3. `<body>` 用 `fb-*` 元件與版面容器組裝，**不要複製**其他頁的元件 HTML：
   ```html
   <fb-topnav active="report-zone"></fb-topnav>
   <main class="page">
     <fb-area-title zh="頁面標題" en="Page Title"></fb-area-title>
     <fb-tabbar active="0"><script type="application/json">[{"zh":"分頁","en":"Tab"}]</script></fb-tabbar>
     <fb-filter-card>
       <div class="filter__grid cols-3">
         <div class="field"><label>欄位</label>
           <fb-dropdown type="multi" search><script type="application/json">{"options":["A","B"]}</script></fb-dropdown>
         </div>
       </div>
     </fb-filter-card>
   </main>
   ```
4. `<body>` 結尾載入 JS（傳統 script，順序固定）：
   ```html
   <script src="../assets/js/icons.js"></script>
   <script src="../assets/js/components.js"></script>
   <script>/* 本頁專屬邏輯（若有）*/</script>
   ```
5. 需要的圖示一律用 `<fb-icon name="...">`；registry 沒有的先加到 `assets/js/icons.js`。
6. 頁面專屬且不可複用的區塊可寫在該頁，但色彩／間距／字級一律 `var(--token)`；
   跑 `npm run lint:tokens` 必須零違規。
7. 新增或調整元件時，更新 `assets/js/components.js` / `assets/css/components.css`（改一處全站生效），
   同步更新 `design/components.md` 與 `pages/_components.html`。

## 調整設計 token

只改 `design/tokens.json` → `npm run build:tokens` → 所有頁面（下次載入 / build）一起變。
`tokens.json` 分三層：`primitive`（原始值）→ `semantic`（語意別名）→ `component`（元件別名）。
標註 `TODO` 的 `figma` 欄位待設計端從 library（node ``）匯出對齊。

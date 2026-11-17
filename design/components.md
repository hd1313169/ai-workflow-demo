# 元件規格對照（fb-*）

視覺對照畫布：[`pages/_components.html`](../pages/_components.html)（kitchen sink，用瀏覽器開啟逐一比對）

規則（見 `openspec/specs/frontend-component-system/spec.md`）：
- 新增／修改元件必須同步更新本檔，並在 PR 附上設計稿截圖對照。
- 元件一律 light DOM、傳統 script；色值只能用 `var(--token)`。

## 動作按鈕文字通則（中英雙語）

所有管理頁與 kitchen sink 的動作按鈕文字採「中文 ＋ 半形空格 ＋ 英文」，依動作類型使用固定字串：

| 類型 | 標準文字 | 說明 |
|---|---|---|
| 新增 | `新增<對象> Add` | 工具列主按鈕，保留加號圖示（例：`新增角色 Add`、`新增使用者 Add`）|
| 編輯 | `編輯 Edit` | 清單列開啟編輯 Modal，不用 `編輯設定` 等變體 |
| 刪除 | `刪除 Delete` | 列內刪除用 `.btn-danger-line`（淺灰框＋紅字＋垃圾桶 icon）；確認對話框主動作仍用 `.btn-danger-outline` |
| 查看 | `查看 View` | 清單列以唯讀方式開啟 Modal，不用 `查看設定` 等變體 |
| 關閉 | `關閉 Close` | 可見文字的關閉按鈕；僅圖示的 × 鈕維持 `aria-label="關閉"` |

---

## fb-icon
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/icons.js` |
| 用法 | `<fb-icon name="fb-plus">`；未指定尺寸時為 `1em`，顏色繼承 `currentColor` |
| registry | `fb-search` `fb-voice` `fb-user` `fb-reset` `fb-export` `fb-calendar` `fb-chevron-down` `fb-chevron-left` `fb-plus` `fb-minus` `fb-close` `fb-edit` `fb-eye` `fb-refresh-cw` `fb-settings` `fb-line-chart` `fb-sort` `fb-info` `fb-info-filled` `fb-alert-triangle` `fb-link` `fb-clock` `fb-check-circle` `fb-check-circle-filled` `fb-close-circle` `fb-outlook` |
| 例外 | `fb-outlook` 為 Outlook 品牌標誌，非 SVG／非 `currentColor`：由 匯出的多色 PNG，以內嵌 `data:` URI 的 `<img class="fb-outlook-img">` 提供（`fb-icon img` 負責尺寸）。為單色圖示慣例的受控例外，仍只作為 registry 項目、透過 `<fb-icon name="fb-outlook">` 取用 |
| 舊 inline SVG 對照 | `CAL_SVG`→`fb-calendar`；`CHV_SVG`→`fb-chevron-down`；`SRCH_SVG`/搜尋框→`fb-search`；topnav 語音→`fb-voice`；topnav 使用者→`fb-user`；`btnReset`→`fb-reset`；`btnExport`→`fb-export`；`IC.plus`→`fb-plus`；`IC.minus`→`fb-minus`；`BACK_SVG`→`fb-chevron-left`；`X_SVG`→`fb-close`；`SORT_UP`/`SORT_DN`→`fb-sort` 或 `FbIcon.sort(dir)` |
| token | 無（顏色由使用端 `color`） |

## fb-topnav
| 項目 | 內容 |
|---|---|
| 屬性 | `active` = `home` \| `customer` \| `marketing` \| `report-zone` \| `tools`；`brand`（預設「示範企業」） |
| 連結 | NAV 項目可帶 `href` + `zone`（`root` = `index.html` 所在層、`pages` = `pages/` 層）；`navHref` 依目前檔案位置（dev 根／dev `pages/`／dist 單檔）解析相對路徑。父層節點（有子選單、自身無 `href`）導向其第一個（遞迴）具 `href` 的子孫頁，子樹全無 `href` 才為 `#`。目前：「首頁」→ `index.html`；「其他工具 > 權限設定」→「角色管理」`role_management.html`；報表中心 →「境內客戶報表」→ `domestic_basic_report.html`、其下方「境外客戶報表」→ `foreign_basic_report.html` |
| 狀態 | 一般 / hover（主色）/ active（底部 3px 主色橫條）/ submenu 展開（hover）/ 三層 submenu |
| token | `--bg-surface` `--line` `--color-ink` `--head-bg-primary` `--color-grey-500` `--color-brand-150` `--shadow-pop` `--radius-md` `--radius-sm` `--pad-sm` |

## fb-area-title
| 項目 | 內容 |
|---|---|
| 屬性 | `zh`、`en`、`icon`（選用，值為 icons registry 名稱）|
| 變體 | 預設（zh／en 基線並排）／`icon`（左側 40px 圓形主色徽章 + zh 大標與 en 小字堆疊）|
| token | `--pad-md` `--gap-xs` `--color-grey-550` `--head-bg-primary` `--head-text-inverse` |

## fb-card-tabs
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.card-tabs*`（components.css）|
| 設定 | 內嵌 JSON `[{zh,en,disabled?,badge?}]`（或 `tabs` 屬性）；`active`（索引）；`badge` 為選填數字，>0 時於 zh 文字右側顯示紅底數字徽章 |
| 事件 | `tab-change` `{ detail: { index } }` |
| 方法 | `setBadge(index, n)` — 更新單一分頁的徽章數字並重繪 |
| 狀態 | 整條為 `--bg-neutral-lv3` 灰帶；未選（透明融入灰帶、深色 zh）／選中（白底 + 2px `--head-bg-primary` 底線 + 主色 zh，無圓角，與卡片本體連為一體）／`disabled`（`--text-faint` 淡色、不可點）／`badge`（紅底白字圓角數字，`badge` 為 0 或未設定時不顯示）|
| 備註 | 與滿版底線式 `fb-tabbar`（報表頁）為不同樣式，不互相取代；左對齊、固定寬 128；zh `--fs-md`/`--lh-md`、en `--fs-sm` |
| token | `--bg-neutral-lv3` `--bg-surface` `--color-ink` `--text-muted` `--head-bg-primary` `--radius-md` `--fs-md` `--lh-md` `--fs-sm` `--lh-sm` `--pad-sm` `--pad-md` `--badge-status-inactive` `--badge-status-text` |

## fb-side-tabs
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.side-tabs*`（components.css）|
| 設定 | 內嵌 JSON `[{zh,en}]`（或 `tabs` 屬性）；`active`（索引）|
| 事件 | `tab-change` `{ detail: { index } }`；點擊或聚焦後按 Enter／Space 皆可觸發，不觸發頁面導覽 |
| 狀態 | 垂直排列；未選（透明底、`--color-ink` zh）／選中（左側 2px `--head-bg-primary` 色條 + `--bg-subtle` 底 + 主色 zh、加粗）|
| 備註 | 與水平排列的 `fb-card-tabs`／`fb-tabbar` 為不同語意與樣式，不互相取代；供「左側分頁切換右側主要內容」版型沿用（例：服務紀錄管理頁） |
| token | `--color-ink` `--text-muted` `--head-bg-primary` `--bg-subtle` `--fs-md` `--lh-md` `--fs-sm` `--lh-sm` `--pad-sm` `--pad-md` `--fw-medium` |

## 圖表套件（Chart.js，vendored）
| 項目 | 內容 |
|---|---|
| 套件 | Chart.js `4.4.4`（UMD build）|
| 檔案 | `assets/js/vendor/chart.umd.js`（本地 vendor，非 CDN；以 `<script src="../assets/js/vendor/chart.umd.js">` 傳統引入，確保 `file://` 可開啟並可被 `build.mjs` 內嵌進 `dist/` 單檔）|
| 用法 | 長條圖／折線圖／圓環圖等資料視覺化一律沿用同一份 vendor 檔，不再各自引入其他函式庫；圖表 dataset 顏色以 `getComputedStyle(...).getPropertyValue('--token')` 讀出對應 token 字串帶入 Chart.js 設定，設定本身不得寫入十六進位或具名色彩字面值 |
| 首個用例 | `pages/service_records.html`（服務紀錄管理 總表 Summary：客戶分頁長條+折線複合圖、研究員分頁圓環圖）|
| token | `--chart-series-bar` `--chart-series-line` `--chart-donut-1` `--chart-donut-2` `--chart-donut-3` `--chart-donut-4` `--chart-donut-5` |

## .chip--changed（異動標籤）
| 項目 | 內容 |
|---|---|
| 檔案 | `.chip--changed`（components.css，搭配既有 `.chip` 基底）|
| 設定 | 靜態 CSS class，非互動（`cursor: default`），搭配 `<span class="chip chip--changed"><span class="chip__label">時間異動</span></span>` |
| 狀態 | 紅底文字（`--tag-bg-error` / `--tag-text-error`），無可點擊／關閉行為 |
| 備註 | 沿用 `.chip` 版型（高度、圓角、字級），僅覆蓋色彩與 cursor，避免另開一份專屬標籤樣式 |
| token | `--tag-bg-error` `--tag-text-error` `--radius-md` |

## fb-segmented
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.segmented*`（components.css）|
| 設定 | 內嵌 JSON `[{value,label,disabled?}]`（或 `[{zh,en,disabled?}]`）；`value`（預設第一項）|
| 事件 | `change` `{ detail: { value } }`；`value` getter/setter；`disabled` 項目不觸發 |
| 狀態 | 單選；選中（白底 `--radius-md` + `--color-ink` medium）／未選（透明 + `--text-secondary`）／`disabled`（`--text-faint`、不可點，比照 `fb-card-tabs` 的 disabled 用法）；外層軌 `--color-grey-180` + `--radius-lg` |
| 備註 | 與 `fb-card-tabs`（灰底軌、底線式 active）為不同樣式，不互相取代；服務紀錄管理頁「總表／明細」需採用本元件（圓角膠囊式），不可誤用 `fb-card-tabs` |
| token | `--color-grey-180` `--radius-lg` `--radius-md` `--gap-xs` `--pad-sm` `--pad-md` `--bg-surface` `--color-ink` `--text-secondary` `--text-faint` `--fw-medium` |

## fb-status-pill
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.status-pill*`（components.css）|
| 屬性 | `state` = `off`（預設）\| `on`；`icon`（選用，registry 名稱，取代預設 `fb-link` 前置圖示，例：Outlook 串接列用 `icon="fb-outlook"`）；`interactive`（選用，設為可點：`role=button`、`tabindex=0`、click / Enter / Space 發 `pill-click` 事件 `{ detail: { state } }`）；`label-on` / `label-off`（選用，隨 `state` 切換 `.status-pill__label` 文字）。文字由 light DOM 內容提供；純文字時自動包裝前置圖示 + `.status-pill__label`，含子元素則原樣保留 |
| 事件 | `pill-click`（僅 `interactive` 時）— `detail.state` 為點擊當下狀態；切換與後續流程（toast／確認 modal）由使用端決定 |
| 狀態 | off（`--status-pill-off-bg` 灰底 + `--status-pill-off-border` 描邊 + `--status-pill-off-text` 字）／on（`--status-pill-on-bg` 綠底 + `--status-pill-on-border` 綠描邊 + `--status-pill-on-text` 綠字）；圓角 `--radius-md`（非全圓角膠囊）；`interactive` hover 微調亮度、`:focus-visible` 主色外框 |
| token | `--radius-md` `--fw-medium` `--status-pill-off-bg` `--status-pill-off-border` `--status-pill-off-text` `--status-pill-on-bg` `--status-pill-on-border` `--status-pill-on-text` `--head-bg-primary` |

## fb-mini-calendar
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.mini-cal*`（components.css）|
| 設定 | `value="YYYY/MM/DD"`、`month="YYYY/MM"`（選用）；內嵌 JSON `{ "events": [ { "date": "YYYY/MM/DD", "kinds": ["personal"\|"service"\|"event"] } ] }` |
| 方法 | `setMonth(delta)`、`goToday`、`select("YYYY/MM/DD")`、`setEvents(list)`；getter `value` |
| 事件 | `date-change` `{ detail: { value } }`；`month-change` `{ detail: { month: "YYYY/MM" } }` |
| 狀態 | 今日（數字為 `--head-bg-primary`）／選取（整格 `--color-brand-100` 淺藍背景、無邊框）／月首月末空白補格（不可點選、不顯示鄰月日期）／每日最多 3 個事件點 |
| 星期列 | `--head-bg-primary` 底、反白，中（日～六）＋英（SUN～SAT）|
| 間距 | 月份 nav 列→圖例 16px、圖例→星期列 20px（對照 Figma）；卡片 padding 16、日格 min-height 60（其餘沿用原值）|
| token | `--bg-surface` `--line` `--radius-lg` `--radius-sm` `--color-ink` `--text-faint` `--head-bg-primary` `--head-text-inverse` `--overlay-primary-06` `--cell-bg-white` `--color-brand-100` `--bg-hover-subtle` `--fw-medium` `--calendar-dot-personal` `--calendar-dot-service` `--calendar-dot-event` |

## fb-schedule-dialog
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.sched*`（components.css）|
| 屬性 | `mode` = `timed`（預設，起訖各自「日期＋時間」）\| `allday`（起訖日期）；`open`（由方法設定）|
| 方法 | `open(data?)`（`data._edit` 為 true → 標題「編輯行程 / Edit Schedule」，否則「新增行程 / Add Schedule」；`data._id` 帶入編輯目標；其餘欄位 `{ title, allDay, date, start, end, startDate, endDate, notes }`）、`close` |
| 事件 | `submit` `{ detail: { id, title, allDay, date, start, end, startDate, endDate, notes } }`（`id` 為編輯時的 `_id`，新增時為 `null`）；`cancel` |
| 欄位 | 標題（原生 input，必填，空值擋送出並標紅）／timed：「開始時間」「結束時間」兩列，每列一組 `fb-date-field` + `fb-time-field`（`.sched__row` 兩欄格線），送出值分別對應 `startDate`/`start` 與 `endDate`/`end`（`date` 仍回傳＝`startDate` 以相容舊讀取）／allday：起訖日期（`fb-date-field`）／全天 checkbox（切換欄位群）／備註 `textarea maxlength=100` + `n/100` 計數。日期／時間欄位改用自訂元件，浮層對齊；不用原生 `type=date` / `type=time`。`submit.detail` 的日期字串維持 `YYYY/MM/DD`、時間 `HH:MM` |
| 起訖驗證 | 內部以 `fbLinkRange` 綁定開始／結束日期（`endDate.min = startDate`；起日改到晚於訖日時推移訖日跟上）；定時模式下若開始＝結束同一天，另綁開始／結束時間界線。`_save` 於標題檢查後再驗一次：`endDate < startDate`，或（定時且同日）`end < start` 時，於「結束」欄位加 `.is-invalid` + `.sched__err` 訊息、`return`，不 `close`、不派發 `submit`；使用者改動任一日期／時間欄位即清除該錯誤 |
| 狀態 | 關閉（`display:none`）／開啟（固定定位 + `--overlay-ink-40` 遮罩）；關閉鈕／Esc／取消 皆 `close` + 派發 `cancel`；點遮罩不關閉 |
| 面板結構 | 與 `fb-modal` 一致的三段式：`.sched__panel` `overflow:hidden`（本身不整塊捲）／固定 `.sched__hd`（標題）／唯一捲動區 `.sched__body`（`flex:1 1 auto; min-height:0; overflow:auto; scrollbar-gutter:stable`）／固定 `.sched__ft`（含上緣分隔線）；內距由 panel 移到各段。`close` 另呼叫 `closeAllOverlays` 收掉殘留的欄位浮層（見文末「欄位浮層通則」）|
| token | `--overlay-ink-40` `--overlay-ink-05` `--bg-surface` `--radius-xl` `--radius-md` `--radius-sm` `--shadow-pop` `--line` `--color-ink` `--text-muted` `--text-faint` `--text-general` `--text-placeholder` `--head-bg-primary` `--accent-danger` `--pad-sm`；取消鈕用 `.btn-neutral-outline`（中性色），主鈕 `.btn-primary` |

## fb-confirm-dialog
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.confirm*`（components.css）|
| 方法 | `open({ heading, headingEn, title, desc, confirmLabel, confirmLabelEn, cancelLabel, cancelLabelEn, tone })`、`close` |
| 事件 | `confirm` / `cancel`；×／Esc／取消 皆派發 `cancel`；點遮罩不關閉 |
| 變體 | `tone="danger"` → 確認鈕 `.btn-danger-outline`（紅描邊）；否則 `.btn-primary`。取消鈕一律 `.btn-neutral-outline`（中性灰框灰字，非主色）|
| token | `--overlay-ink-40` `--overlay-ink-05` `--bg-surface` `--radius-lg` `--radius-sm` `--shadow-pop` `--line` `--color-ink` `--text-faint` `--text-muted` `--text-secondary` `--fs-h4` `--lh-h4` `--fs-md` `--lh-md` `--lh-sm` `--pad-md` `--accent-danger` |

## fb-toast
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.toast*`（components.css）|
| 方法 | `show(message, { tone, desc })`（`tone`：`success`（預設）\| `danger`；`desc` 選填第二行說明；3.2s 自動消失）、`hide` |
| 樣式 | `position:fixed` 右上；`success`＝`--toast-bg-success` 底 / `--toast-text-success` 字 / `--toast-icon-success` 圖示（`fb-check-circle`）；`danger`＝`--toast-bg-danger` 底 / `--toast-text-danger` 字 / `--toast-icon-danger` 圖示（`fb-close-circle`）。`--radius-lg`、× 可關；文字包 `.toast__text`（縱向），`.toast__msg`＝`--fs-md`、`.toast__desc`＝`--fs-xs`（無 `desc` 時不輸出）|
| token | `--toast-bg-success` `--toast-text-success` `--toast-icon-success` `--toast-bg-danger` `--toast-text-danger` `--toast-icon-danger` `--radius-lg` `--fs-md` `--lh-md` `--fs-xs` `--lh-xs` `--shadow-sm` `--pad-sm` `--text-muted` |

## .select-card（共用 class，非 fb-*）
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/css/components.css` / `.select-card*` |
| 用法 | 卡片式可選項目；由 `fb-export-dialog` 內部組裝，亦可其他頁沿用。結構：`.select-card.select-card--{radio\|checkbox}` > `.select-card__marker` + `.select-card__body`（`.select-card__title` + 選用 `.select-card__desc`）|
| 變體 | `--radio`（圓形標記、選中內圓點）／`--checkbox`（方形標記、選中打勾）；排列輔助 `.select-card-grid`（3 欄，≤640px 單欄）|
| 狀態 | 未選（白底 `--line` 框）／選中 `.is-selected`（`--cell-bg-blue` 底 + `--head-bg-primary` 框與標記）／禁用 `.is-disabled`（0.5 透明、`not-allowed`）／`:focus-visible`（`--overlay-primary-06` 外光暈）|
| token | `--line` `--bg-surface` `--cell-bg-blue` `--head-bg-primary` `--head-text-inverse` `--color-grey-550` `--color-ink` `--text-secondary` `--fs-md` `--lh-md` `--fs-sm` `--lh-sm` `--fw-medium` `--gap-xs` `--pad-sm` `--pad-md` `--radius-lg` `--radius-xs` `--overlay-primary-06` |

## fb-export-dialog
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.expdlg*`（components.css）|
| 方法 | `open(config?)`、`close`。`config`：`time`(`monthly`\|`weekly`，預設 `monthly`)、`metrics`(`['mtd','ytd','mom','yoy','monthlyize']` 子集，預設全選)、`detailLevel`(`affiliate`\|`category`\|`foreignCategory`\|`household`\|`account`，預設 `affiliate`；`foreignCategory` 僅 `foreignMode` 時可選，否則正規化回 `category`)、`summary`(`['subtotal','total']` 子集，預設全選)、`marketShareMode`(bool)、`partialMonthMode`(bool)、`foreignMode`(bool，預設 `false`——`true` 時為境外版，僅 `pages/foreign_basic_report.html` 呼叫時傳入) |
| 事件 | `export` `{ detail: { time, metrics, detailLevel, summary, dmaExport? } }`（`dmaExport` 僅 `foreignMode` 時才附帶；按「匯出 Export」→ 進 Loading 態 → 約 800ms 後派發並 `close`；`detailLevel === 'account'` 時 `summary` 為 `[]`）；`cancel`（×／Esc／「取消 Cancel」；點遮罩不關閉）|
| 區塊 | Header 說明文字（`.expdlg__note`）為資安密碼加密說明：「為符合資安規範，匯出之檔案將採取強制密碼加密。檔案開啟密碼預設為您的「登入帳號」（英文字母請大寫），請妥善保管下載檔案。」／報表時間維度（radio）／統計比較指標 可多選（checkbox，3 欄）／客戶明細層級（radio，境內頁四層級：集團戶彙總／產業類別彙總／客戶群彙總／**客戶帳號明細**；境外頁 `foreignMode:true` 於產業類別彙總與客戶群彙總間多「境外分類彙總」，且最後一層改名為**子帳號明細**〔說明文字多「子帳號」：展開至客戶名稱、主帳號、子帳號、業務員〕，共五層級）／彙總計算 可多選（checkbox：包含小計／包含總計）／**境外專屬**「專案交易匯出」開關區塊（`<fb-toggle variant="card">`，僅 `foreignMode:true` 顯示，預設開啟；說明：「包含並獨立呈現 專案交易 交易數據列，總計列下方，保留一列獨立的 專案交易 交易彙總數據。」）；footer：`重置預設值 Reset`（左）＋`取消 Cancel`＋`匯出 Export` |
| 連動 | 彙總計算 × 客戶明細層級：明細層級＝`客戶帳號明細`/`子帳號明細`（`account`）時，「包含小計」「包含總計」兩張卡片強制取消勾選＋`.is-disabled`（區塊標題不淡化，`[data-section="summary"]` 不加 `.is-disabled`）；由 `account` 切回其他層級 → 彙總計算還原為兩項皆選（不論是否 `partialMonthMode` 皆適用）。**境外專屬**：明細層級＝`account`（子帳號明細）時，「客戶明細層級」區塊內額外顯示隱碼警示（`[data-warn-sub]`）：「子帳號展開後資料筆數極多。系統將自動對客戶主帳號進行隱碼遮蔽（如 969\*\*\*45），子帳號則完整呈現。」，且「專案交易匯出」開關強制關閉並加上 `disabled` 屬性（不可操作）；切回其他層級則警示隱藏、開關恢復可操作並還原為預設開啟（「展開至子帳號」狀態）。`.expdlg__warn` 系列警示（含既有的非1號開始警示 `[data-warn]` 與此處的 `[data-warn-sub]`）圖示皆為 `fb-alert-triangle`（非 `fb-info-filled`），底色／文字色沿用 `--tag-bg-warning` / `--tag-text-warning`（即 Figma toast 的 emphasize-warning 配色）|
| 狀態 | 預設（月份累計＋五指標全選＋明細層級＝集團戶彙總＋彙總計算兩項皆選；境外頁另加 專案交易匯出預設開啟）／`marketShareMode`（`月化` checkbox 停用＋停用卡片 `data-tip` 由共用 `fb-tooltip` 顯示提示文字——境內「佔比全月結算無實質買業務意義」、境外「佔比全月推算無實質業務意義」，文案不同；不影響明細層級／彙總計算）／`partialMonthMode`（頂部 `--tag-bg-warning` 警告＋「報表時間維度」「統計比較指標」兩區 `.is-disabled` 且區內所有選項皆不預設選取；「客戶明細層級」「彙總計算」「專案交易匯出」維持與 1 號情境相同，僅依上述連動規則）／`[busy]`（Loading：body 半透明不可操作）|
| 尺寸 | 60vw / 80vh、max-width 804px、min-height 360px（無 max-height 上限）；≤640px 近全螢幕。開啟時鎖定底層頁面捲動（見「Modal／對話框通則」）|
| token | `--overlay-ink-40` `--overlay-ink-05` `--bg-surface` `--color-grey-100` `--line` `--color-ink` `--text-secondary` `--text-muted` `--head-bg-primary` `--head-text-inverse` `--cell-bg-blue` `--tag-bg-warning` `--tag-text-warning` `--fs-h2` `--lh-h2` `--fs-md` `--lh-md` `--fs-sm` `--lh-sm` `--fw-medium` `--pad-sm` `--pad-md` `--gap-xs` `--radius-xl` `--radius-lg` `--radius-sm`；取消鈕用 `.btn-neutral-outline`（中性色），主鈕 `.btn-primary` |

## fb-batch-export-dialog
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.bxdlg*`（components.css）|
| 方法 | `open({ count, limit })`（`limit` 預設 2000）、`close`；內部 `batches = ceil(count / limit)`（`count` 為 0 時視為 1）|
| 事件 | `export` `{ detail: { count, limit, batches } }`（按主按鈕）；`cancel`（×／Esc／「取消」；點遮罩不關閉）|
| 內容 | Header「匯出 / Export」＋ ×；資訊區塊「查詢結果 共 N 筆」，`count > limit` 時再顯示「超過單次下載上限（M 筆），系統將自動分批下載 共 B 批」；註記行 `.bxdlg__note`（`fb-info`）：超過上限＝「每批約 M 筆，檔案格式：CSV」、未超過＝「檔案格式：CSV」；footer：「取消」（`.btn-neutral-outline`）＋主按鈕（未超上限＝「下載」、超過＝「分批下載」，`.btn-primary`）|
| 狀態 | 未超過上限（不顯示分批提示）／超過上限（顯示批數與每批筆數）；開啟時鎖定底層頁面捲動（見「Modal／對話框通則」）|
| 尺寸 | 60vw、max-width 792px、min-width 420px、高度隨內容；≤640px 近全螢幕 |
| token | `--overlay-ink-40` `--overlay-ink-05` `--bg-surface` `--color-grey-100` `--line` `--color-ink` `--text-secondary` `--text-muted` `--color-grey-500` `--head-bg-primary` `--head-text-inverse` `--fs-h2` `--lh-h2` `--fs-md` `--lh-md` `--fs-sm` `--lh-sm` `--fw-medium` `--pad-sm` `--pad-md` `--radius-xl` `--radius-lg` `--radius-sm` |

## fb-tabbar
| 項目 | 內容 |
|---|---|
| 設定 | 內嵌 `<script type="application/json">[{zh,en,href?}...]</script>`（或 `tabs` 屬性）；`active`（索引）|
| 事件 | `tab-change` `{ detail: { index } }`（僅無 `href` 的分頁會觸發）|
| 連結分頁 | 分頁項帶 `href`（相對路徑，如 `role_management.html`）時，點擊改為 `location.href` 導向該頁，不切換 `active`、不發 `tab-change`；用於角色管理 ↔ 使用者管理互跳，及境內／境外客戶報表頁互跳（兩頁 tab 清單的「境內客戶報表」`domestic_basic_report.html`／「境外客戶報表」`foreign_basic_report.html` 皆帶 `href`，其餘尚未實作的分頁不帶）|
| 狀態 | 一般 / hover / active（底線＋主色）|
| token | `--line` `--color-ink` `--color-grey-500` `--head-bg-primary` |

## fb-filter-card
| 項目 | 內容 |
|---|---|
| 用法 | 把 `.filter__grid` / `.field` 子節點包進 `.filter` 卡片；不含欄位邏輯 |
| 欄位標題 | `.field > label`：字型 `--font-cn`、字級 `--fs-sm`（14px）、行高 `--lh-sm`（20px）、字重 `--fw-medium`（500）、主色 `--form-label-text`（#0c0e1f）；英文／括號註記 `.en` 為 `--fw-regular` + `--form-label-note`（#5e5f6b）；標題與控制項間距 `--gap-2xs`（2px）。對照 Figma `Content/CN/H6 (Sm)` / `form/text/title/default` / `form/text/optional note/default`。同一組值套用於各管理頁 Modal 的 `.as-field` / `.mm-field` / `.om-field` / `.rm-field` / `.um-field > label` 與行程對話框 `.sched__lbl`，各頁不得自行硬編字級或顏色 |
| token | `--bg-surface` `--line` `--radius-xl` `--shadow-sm` `--font-cn` `--fs-sm` `--lh-sm` `--fw-medium` `--fw-regular` `--form-label-text` `--form-label-note` `--gap-2xs` |

## fb-dropdown
| 項目 | 內容 |
|---|---|
| 設定 | `type` = `single` \| `multi`；`search`（boolean）；`placeholder`；內嵌 JSON `{ options, value }` |
| 事件 | `change` `{ detail: { value } }`；方法 `reset` |
| 狀態 | closed / open / hover option / single 選中（灰底）/ multi 全選 / multi 清空（placeholder）/ 搜尋過濾 |
| token | `--line` `--bg-surface` `--color-ink` `--head-bg-primary` `--radius-md` `--radius-sm` `--shadow-pop` `--text-placeholder` `--color-grey-550` `--color-grey-500` `--color-grey-130` `--color-grey-150` `--pad-sm` |

## fb-date-field
| 項目 | 內容 |
|---|---|
| 設定 | `value="YYYY/MM/DD"`；`min` / `max`（`YYYY/MM/DD`，可用屬性或 JS property 設定，可反應）|
| 事件 | `change` `{ detail: { value } }`（按「確認」時）；方法 `reset`；屬性 `value`（getter）、`min` / `max`（getter/setter）|
| 狀態 | closed / open；換月 / 選日（草稿）/ 清除（還原）/ 確認（套用）/ 週末紅字 / 非本月淡字 / **超出 `min`–`max`（`.oor`：刪除線、不可點）**；浮層 `fixed` 掛載 `<body>`（見文末「欄位浮層通則」）|
| 範圍限制 | 早於 `min` 或晚於 `max` 的日期格禁用；按「確認」時草稿若超出範圍則不套用、不關閉、不派發 `change`；`min > max` 時全部禁用（不丟例外）；浮層開啟中變更 `min`/`max` 會即時重繪 |
| token | `--line` `--bg-surface` `--radius-lg` `--radius-sm` `--shadow-pop-strong` `--color-ink` `--text-muted` `--color-grey-130` `--color-grey-150` `--color-grey-160` `--color-grey-350` `--calendar-weekend` `--head-bg-primary` `--head-text-inverse` `--pad-sm` |

## fb-time-field
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.time-ctrl` `.timepop`（components.css）|
| 設定 | `value="HH:MM"`（24 小時制，時分補零）；`min` / `max`（`HH:MM`，屬性或 JS property，可反應）|
| 事件 | `change` `{ detail: { value } }`（每次步進即時派發；值未變動時不派發）；方法 `reset`；屬性 `value`（getter/setter）、`min` / `max`（getter/setter）|
| 狀態 | closed / open；唯讀輸入 + `fb-clock` 圖示；浮層內「時 : 分」上下步進（時 0–23、分 0–59）；未設 `min`/`max` 時循環進位，設了則以總分鐘 clamp 至 `[min, max]`（不迴繞、到界即停）；遵循 overlay 單一開啟／點外部或 Esc 關閉；浮層 `fixed` 掛載 `<body>`（見文末「欄位浮層通則」）|
| token | `--line` `--bg-surface` `--radius-md` `--radius-lg` `--radius-sm` `--shadow-pop-strong` `--color-ink` `--color-grey-130` `--text-muted` `--fw-medium` `--pad-sm` |

## fb-datetime-field
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.dtfield` `.dtpop`（components.css）|
| 設定 | `value="YYYY/MM/DD HH:MM"`（空值顯示 `placeholder`，預設「請選擇」）；`min` / `max`（同格式字串，屬性或 JS property，可反應；字典序可比較）|
| 事件 | `change` `{ detail: { value } }`（按「確認」或「清除」時）；方法 `reset`（還原為 `value` 屬性）；屬性 `value`（getter/setter，空值回傳 `''`）、`min` / `max`（getter/setter）|
| 狀態 | closed / open；浮層 = 月曆（換月 / 選日草稿 / 週末紅字 / 非本月淡字 / 整日皆超出 `min`–`max` 的 `.oor` 刪除線禁用）+ 時間列（時 0–23、分 0–59 循環步進）+ 清除 / 確認；按「確認」時若結果超出 `min`/`max` 以字串 clamp 至邊界；遵循 overlay 單一開啟／點外部或 Esc 關閉；浮層 `fixed` 掛載 `<body>`（見文末「欄位浮層通則」）|
| 成對聯動 | 可用 `fbLinkRange(startEl, endEl, { kind:'datetime' })`：訖值不早於起值；起值改到晚於訖值時推移訖值跟上（見文末 `fbLinkRange`）|
| token | `--line` `--bg-surface` `--radius-md` `--radius-lg` `--radius-sm` `--shadow-pop-strong` `--color-ink` `--color-grey-130` `--color-grey-160` `--color-grey-350` `--text-muted` `--text-placeholder` `--calendar-weekend` `--head-bg-primary` `--head-text-inverse` `--fw-medium` `--pad-sm` |

## fb-tooltip
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js`（單例、document 事件委派）/ `.fb-tooltip`（components.css）|
| 用法 | 於任一元素加 `data-tip="文字"`；hover / focus 顯示深底白字帶三角浮層，移出／失焦隱藏。取代行事曆清單溢出儲存格與 Outlook 串接說明圖示的原生 `title`。`data-tip` 內以 `&#10;` 換行（`white-space: pre-line`）|
| 溢出判斷 | 元素具截斷樣式（`text-overflow:ellipsis` 或 `-webkit-line-clamp`）時，僅在 `scrollWidth/scrollHeight` 實際溢出才顯示；無截斷樣式則作為一般提示一律顯示 |
| 定位 | 預設置於來源上方置中，空間不足翻轉下方（`.fb-tooltip--below`）；三角以 `--tip-arrow-x` 對準來源中心 |
| token | `--tooltip-bg` `--tooltip-text` `--tooltip-radius` `--shadow-pop` `--fs-sm` `--lh-sm` |

## fb-chip
| 項目 | 內容 |
|---|---|
| 屬性 | `label`（或內文）、`active`、`closable` |
| 事件 | `chip-select`、`chip-close` |
| 狀態 | 未選（灰底）/ 選中（`chip--active` 主色）/ 可關閉（`fb-close` 按鈕）/ 長字截斷 |
| token | `--radius-md` `--fw-medium` `--color-grey-100` `--color-slate-600` `--cell-bg-blue` `--head-bg-primary` |

## fb-modal
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.modal*`（components.css）|
| 尺寸 | `60vw` / `80vh`；`min-width 480` `max-width 800` / `min-height 360` `max-height 680`；`≤640px` 近全螢幕、footer 垂直堆疊（與 `fb-export-dialog` max-width 804 相差 4px）|
| 用法 | light DOM 子節點：帶 `data-modal-footer` 者移入 sticky footer，其餘移入可捲 body |
| 屬性 | `heading` / `heading-en`（初始標題）；`open`（顯示）|
| 方法 | `open`、`close`、`setHeading(zh, en)`；getter `isOpen` |
| 事件 | `modal-open` / `modal-close`；×／Esc／`[data-modal-cancel]`／`[data-modal-close]` 皆關閉；點遮罩（`[data-modal-mask]`）不關閉 |
| 狀態 | 關閉（`display:none`）/ 開啟；`<=640px` 近全螢幕、footer 垂直堆疊 |
| token | `--overlay-ink-40` `--overlay-ink-05` `--bg-surface` `--radius-xl` `--radius-sm` `--shadow-pop` `--line` `--color-ink` `--text-faint` `--text-muted` `--pad-md` `--pad-sm` |

### Modal／對話框通則：開啟時鎖定底層捲動
全螢幕遮罩對話框（`fb-modal`／`fb-schedule-dialog`／`fb-confirm-dialog`／`fb-export-dialog`，及未來同類元件）於 `open` 時鎖定底層頁面捲動、`close` 時解除；以計數器支援對話框堆疊（最後一個關閉才解鎖），並補償捲軸寬度避免內容水平位移；`disconnectedCallback` 兜底解鎖。實作：`components.js` 的 `lockScroll`／`unlockScroll` ＋ `html.fb-scroll-locked{overflow:hidden}`。對話框內部自身的可捲區不受影響。

### 欄位浮層通則：fixed 定位並掛載於 body
`fb-date-field`／`fb-time-field`／`fb-datetime-field` 的展開浮層（`.datepop`／`.timepop`／`.dtpop`）開啟時 `document.body.appendChild(pop)` 移到 `<body>`、`position:fixed; z-index:150`（高於全螢幕對話框面板層），顯示由浮層自身的 `.is-open` 控制（不再用「宿主 `.open` + 後代選擇器」）；關閉時還原節點回宿主。定位走共用函式 `FbOverlays.place(anchor, pop)`：對齊觸發欄位正下方（間距 6px），下方空間不足且上方足夠則上翻，最後夾在視窗內（邊距 8px）。開啟期間監聽 `window` 的 `scroll`（**capture**，涵蓋 `.sched__body` 等內層捲動容器）與 `resize` 即時重定位，關閉時解除。`fb-modal`／`fb-schedule-dialog` 的 `close` 會 `closeAllOverlays` 一併關閉。目的：脫離對話框內文 `overflow` 裁切與 `.sched__panel` `transform` 包含塊。

## fb-info-table
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.infotable*`（components.css）|
| 用法 | 內含 `<script type="application/json">[{ "label": "操作時間", "value": "…" }, …]</script>`，或以 `rows` setter 指定 |
| 資料格式 | rows 陣列，每列 `{ label: string, value: string }`；`value` 為空字串時該列 value 欄顯示「-」 |
| 版面 | label 欄固定寬 `120px`、value 欄 `flex:1` 可換行（`white-space:pre-wrap; word-break:break-word`）；單行列高約 `48px`，長值撐高 |
| 屬性／方法 | `rows` getter/setter；無其他屬性、無事件（唯讀，無排序／篩選／列互動）|
| 狀態 | 一般多列 / 含長值換行列 / 含空值（「-」）列；相鄰列白（`--cell-bg-white`）／藍（`--cell-bg-blue`）交錯 |
| token | `--cell-bg-white` `--cell-bg-blue` `--cell-text` `--line` `--pad-sm` `--fs-sm` `--lh-sm` |

## fb-loader / .is-loading（按鈕處理中）
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/icons.js`（`fb-loader` 圖示）/ `.is-loading` `@keyframes fb-spin`（components.css）|
| 用法 | 呼叫端為按鈕加 `.is-loading` 並把內部 `fb-icon` 換成 `name="fb-loader"`；處理結束移除 `.is-loading`、還原圖示 |
| 行為 | `.is-loading` 下內含圖示持續旋轉（`fb-spin 0.8s linear infinite`）、`pointer-events:none`、`opacity:0.7`；純 transform 動畫不涉色值 |
| token | 無（僅動畫；顏色由使用端 `color` 繼承）|

## fb-toggle
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.toggle*`（components.css）|
| 屬性 | `checked`、`disabled`、`variant="card"`（搭配 `zh` / `en` / `desc`）|
| 事件 | `change` `{ detail: { checked } }`；property `checked`（get/set）|
| 狀態 | on / off / disabled；`card` 變體＝主色描邊卡＋標題／副說明 |
| token | `--head-bg-primary` `--head-text-inverse` `--bg-surface` `--bg-subtle` `--color-grey-300` `--color-ink` `--text-secondary` `--text-muted` `--radius-md` `--shadow-sm` `--overlay-primary-06` `--fs-md` `--fw-medium` `--pad-sm` `--pad-md` |

## fb-icon-toggle
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.icon-toggle*`（components.css）|
| 用途 | 通用「單一圖示、兩態切換」按鈕，非綁定星星語意；首個使用點為首頁行事曆服務/活動分頁的「追蹤 F/U」欄 |
| 屬性 | `off-icon` / `on-icon`（icons registry 名稱，如 `fb-star-outline` / `fb-star-filled`）、`on`、`disabled` |
| 事件 | `change` `{ detail: { on } }`；property `on`（get/set）|
| 狀態 | 未選取（off-icon，`--text-faint`）／選取（on-icon，`--color-amber-400`）／disabled（淡化、不可點）|
| 備註 | 元件本身不內建網路請求或持久化；狀態是否保留由呼叫端決定 |
| token | `--text-faint` `--color-amber-400` `--bg-subtle` `--overlay-primary-06` `--radius-sm` |

## fb-stat-card
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.stat-card*`（components.css）|
| 屬性 | `icon`（icons registry 名）、`zh`、`en`、`value`（property `value` 可設）、`tone`（`primary` 預設 \| `success` → icon 用 `--badge-status-active` 綠 \| `warning` → icon 用 `--color-orange-500` 橘）|
| 用途 | 純展示；不派發事件。icon 無徽章底、直接上色（：總使用者數＝主色 `fb-user`、啟用中帳號＝綠 `fb-check-circle-filled`、代理中人數＝橘 `fb-refresh-cw`）|
| token | `--line` `--radius-xl` `--bg-surface` `--shadow-sm` `--head-bg-primary` `--badge-status-active` `--color-orange-500` `--color-ink` `--text-faint` `--fs-md` `--fw-medium` `--pad-md` |

## fb-perm-tree
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.perm-tree*` `.perm-chk*`（components.css）|
| 設定 | 內嵌 `<script type="application/json">{ columns:[...], modules:[{ key, zh, en, pages:[{ zh, caps:[...] }] }] }</script>`；未提供時用內建 `PERM_TREE_DATA`（5 主模組 / 12 功能頁面）。`caps` 缺項＝該欄不可勾 |
| 欄位 | `功能模組 Function` ＋ `檢視 Read` / `新增/編輯 Edit` / `刪除 Delete` / `匯出 Export` |
| 工具列 | `一鍵全選`＝`--head-bg-primary` 主色（button/text/secondary）；`全部清空`＝`--color-ink` 中性（button/text/tertiary）|
| 收合鈕 | 對照 Figma：獨立 36×44 欄、12px 細 chevron；展開＝朝上（`rotate(180deg)`）、收合＝朝下（`is-collapsed` → `rotate(0)`）|
| 方法 | `selectAll`、`clearAll`、`getSelection` → `{ moduleKey: { pageZh: [caps] } }`、`setSelection(sel)`（`'all'` \| `{ moduleKey: 'all' \| [pageZh] \| { pageZh: 'all' \| [caps] } }`；載入時會依相依規則補上 read）|
| 事件 | `perm-change` `{ detail: { checked, total, exportChecked } }`（`total` = 48；`exportChecked` = 已勾選的匯出欄數，匯出即特權，最多 12）|
| 相依規則 | `檢視 Read` 為 `新增·編輯 / 刪除 / 匯出` 的前提：勾任一後三項 → 自動補勾 read；取消 read → 自動取消後三項；read 可單獨勾選。父列名稱、欄位標頭、頁面列勾選皆一併套用 |
| 狀態 | 父列（模組）／欄位標頭 checkbox 三態（全選 / 部分 `is-indeterminate` / 未選）；父列可收合（`is-collapsed` 隱藏子列）；停用格 `is-disabled` |
| 尺寸 | 列 `min-height 48`（表頭 52）、`.perm-tree__fn` / `.perm-tree__col` padding 12 |
| 文字色 | 欄標頭＝一般色（`--text-muted` / `--color-ink` / `--text-placeholder`）；父模組列 **藍 / 綠交替**（依模組索引，`is-alt` = 奇數列）：偶數＝`--perm-tree-parent-bg` 底 + `--head-bg-primary` 名；奇數＝`--perm-tree-parent-bg-alt` 底 + `--color-green-500` 名（ analogous-layer1 / status-decrease）|
| token | `--perm-tree-parent-bg` `--perm-tree-parent-bg-alt` `--color-green-500` `--line` `--radius-md` `--radius-xs` `--color-grey-100` `--color-grey-130` `--color-grey-200` `--color-grey-350` `--bg-surface` `--head-bg-primary` `--head-text-inverse` `--text-link` `--text-muted` `--text-placeholder` `--color-ink` `--fs-sm` `--fw-medium` `--overlay-primary-06` |

## fb-transfer
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.transfer*`（components.css）|
| 設定 | 內嵌 `<script type="application/json">{ items:[{ id, label }], value:["id"...], leftTitle, rightTitle }</script>`；或 `left-title` / `right-title` 屬性覆寫標題 |
| 結構 | `grid` 三欄（`1fr auto 1fr`）：左欄 / 中間按鈕列 / 右欄。每欄＝標題（`.transfer__title`，框外、`--fs-md` medium）＋方框（`.transfer__box`，`--line` 框、`--radius-xs`＝4px）：灰底搜尋列（`.transfer__search`，`--transfer-box-header-bg`）內嵌白色搜尋框（`--radius-xs`、icon 靠右）＋白底可捲清單（`.transfer__list`，`height 264px`）|
| 中間按鈕 | 4 顆 36×36 方鈕（`.transfer__move`，`--radius-xxs`＝2px）：內為 `fb-chevron-left` SVG（18px、白色、flex 置中；右向鈕整體 `rotate(180deg)`；「全部」鈕疊兩個箭頭 `margin-left:-9px`）—— 選取右移 / 全部右移 / 選取左移 / 全部左移。單筆鈕 `--single`＝`--transfer-move-bg`；全部鈕 `--all`＝`--transfer-move-bg-strong`。無可搬移項目時 `disabled`（`opacity .4`）|
| 互動 | 清單為**多選**：點列切換選取（`.is-selected`，藍底藍字）；`›`/`‹` 搬移目前選取項，`»`/`«` 搬移該欄「搜尋過濾後可見」的全部項目；搬移後清空選取。搜尋僅影響顯示、不改變分配 |
| 方法 | `value`（getter/setter，右欄 id 陣列，依 items 原順序）、`setData(items, value)` 重新初始化（皆清空選取與搜尋）|
| 事件 | `transfer-change` `{ detail: { value: string[] } }`（任一次搬移後）|
| token | `--line` `--radius-xs` `--radius-xxs` `--bg-surface` `--transfer-box-header-bg` `--transfer-move-bg` `--transfer-move-bg-strong` `--transfer-move-icon` `--color-grey-500` `--color-brand-100` `--bg-hover-subtle` `--head-bg-primary` `--color-ink` `--text-faint` `--text-placeholder` `--fs-md` `--lh-md` `--fs-sm` `--fw-medium` `--pad-sm` `--pad-md` |

## fb-pagination
| 項目 | 內容 |
|---|---|
| 檔案 | `assets/js/components.js` / `.pager*`（components.css）|
| 設定 | 內嵌 `<script type="application/json">{ total, page, pageSize, sizes:[..] }</script>`；或屬性 `total` / `page` / `page-size` / `sizes`（逗號分隔）。`sizes` 未給時預設 `[20, 50, 100]`；目前 `pageSize` 不在 `sizes` 內會自動補入首位 |
| 結構 | `flex` 三段、**整體靠右**（`justify-content:flex-end`、gap 16）：`.pager__info`（顯示第 X 到 Y 筆，共 T 筆資料；`--color-ink`、tabular-nums、無粗體）＋ `.pager__num`（`.pager__btn` 高 40、外框相連 `margin-left:-1px`、僅最外側圓角；前一頁／下一頁只放 `fb-chevron-left`/`fb-chevron-right`；省略號 `.pager__ellipsis` 放 `fb-more-horizontal`）＋ `.pager__size`（「每頁顯示」＋ `.pager__select`（`appearance:none` 的 `<select>` ＋ `.pager__caret` 放 `fb-chevron-down`）＋「筆」）|
| 頁碼窗 | `_pageList` 元件數固定為 **7**（`總頁數 ≤ 7` 時全部列出）：第 1、末頁恆為數字，中段隨目前頁移動並以省略號補位 —— 近頭 `1 2 3 4 5 … L`／中間 `1 … p-1 p p+1 … L`／近尾 `1 … L-4 L-3 L-2 L-1 L`。不論在哪一頁，頁碼＋省略號的按鈕數量一致（含 `‹`／`›` 共 9 顆）。目前頁 `.is-active`（`--accent-primary` 外框＋`--accent-primary` 文字，非填色）且點擊無效。第一頁時 `‹` disabled、末頁時 `›` disabled |
| 方法 | `setTotal(total, page?)`（重繪，**不派事件**）；getter `page` / `pageSize` / `pageCount` |
| 事件 | `page-change` `{ detail: { page, pageSize } }`（點頁碼／箭頭，或改每頁筆數；改每頁筆數時 `page` 一律重置為 1）|
| token | `--fs-md` `--lh-md` `--color-ink` `--fw-medium` `--line` `--radius-md` `--bg-surface` `--bg-hover-subtle` `--accent-primary` `--text-faint` `--text-muted` |

## 儀表板／實心圖示（icons.js）
- `fb-refresh-cw`（32、實心）、`fb-time`、`fb-calendar-filled`、`fb-file-document`：對照 Figma 儀表板，皆 `currentColor`，顏色由使用端以 token 指定（橘＝`--color-orange-500`、主色藍＝`--accent-primary`、綠＝`--color-green-500`、中性灰＝`--text-secondary`）。
- `fb-chevron-right`、`fb-more-horizontal`：`fb-pagination` 用。

## 組織管理頁專屬 class（`pages/organization_management.html` 頁內 `<style>`，僅引用 token）
- `.om-table` — 組織表（頁面專屬、未元件化）：表頭 `--color-grey-100` 底＋`--color-ink` 字，排序沿用 `.sort-ic` + `FbIcon.sort`（覆寫為 `--color-grey-500`），比照 `.rm-table`。
- `.om-state--on` / `.om-state--off` — 狀態徽章：與 `role_management` 的 `.rm-state` 等價（實心膠囊、白字，啟用＝`--badge-status-active`、停用＝`--badge-status-inactive`）。
- `.om-edit-btn` — 「編輯 Edit」：沿用 `.btn-outline` + 鉛筆 icon，微調 padding／字級。
- `.om-field` / `.om-input` / `.om-counter` — Modal 內組織代號／名稱欄位與字數計數（`x/上限`）。
- `.om-empty` — 查無資料空狀態列。

## 角色管理頁專屬 class（`pages/role_management.html` 頁內 `<style>`，僅引用 token）
- `.rm-mod-tag.m-{home,customer,marketing,report,tools}` — 授權功能範圍模組標籤：outline tag（`--radius-xs`、`--fs-sm`/`--lh-sm`），色系對應 tag error/warning/promotion/await/completed（`--module-{key}-bg` / `--module-{key}-border` / `--module-{key}-text`）。顯示邏輯（由 `moduleState(role,key)` 決定）：`is-full`（該模組全部功能）＝tint 底＋同色框；`is-partial`（部分功能）＝tint 底、無框、`opacity .55` 淡化；`none`＝不渲染該標籤（全無時顯示 `.rm-scope-empty` 破折號）。
- `.rm-users--{zero,low,high}` — 使用人數標籤：`0`＝`--tag-bg-error`/`--tag-text-error`、`<20`＝`--tag-bg-info`/`--tag-text-info`、`>=20`＝`--tag-bg-success`/`--tag-text-success`。
- `.rm-state--on` / `.rm-state--off` — 狀態徽章：實心圓角膠囊、白字（`--badge-status-text`），啟用＝`--badge-status-active`（#008578）、停用＝`--badge-status-inactive`（#d7333d）。
- `.rm-edit-btn` — 編輯 Edit：沿用 `.btn-outline`（主色藍框＋藍字，鉛筆 icon 繼承 `currentColor` 為藍），僅微調 padding／字級。
- `.rm-table` — 角色表（頁面專屬、未元件化）：表頭 `--color-grey-100` 底＋`--color-ink` 字（非反白），排序沿用 `.sort-ic` + `FbIcon.sort`，此表覆寫 `.sort-ic` 為 `--color-grey-500`。
- `.rm-count` — Modal footer 計數文字（`已勾選 n/48 …`）。

---

## 報表 `<table>`（頁面專屬，未元件化）
`pages/domestic_basic_report.html` 內的 `build` 為此頁客製，不抽成共用元件；僅要求所有樣式值使用 token（`.report*` 規則見 `assets/css/components.css`）。
相關設計稿狀態：年度／月份展開、年度分析欄、非整月簡化模式（KPI 變體：淨收益、交易量、佔比）。

行為要點：
- **非整月簡化模式**：filter「資料日期(起)」非 1 號時，不做年度／月份／週／分析欄展開，僅 4 凍結標籤欄 + 單一「累計{績效指標}」欄（`累計淨收益` / `累計交易量` / `累計佔比`）。
- **分析欄收在單月內**：`MTD / 月化 / MoM / YTD / YoY` 僅在展開某月份時橫向接在該月右側（與週資料同層），年度層不再常駐分析欄。
- **佔比無月化**：績效指標＝佔比時，展開月份的分析欄為 `MTD / MoM / YTD / YoY`（無「月化」）。
- **窄表填滿**：欄合計寬 < `.table-wrap` 可視寬時，`table` 加 `.report--fill`（`width:100%`、資料欄 `<col>` 改 `width:auto` 平均分配）；否則維持固定欄寬 + 水平捲動。容器寬變化以 `ResizeObserver`（debounce）重算。
- **預設收合產業類別**：初次載入與 Reset 後，`seedCollapsed` 將 `toggleCol=2`（產業類別層）的 sub 列加入 `collapsedRows`，不展開到客戶群；集團戶層維持展開。
- **返回按鈕**：`renderOpsLeft` 的「返回」僅 `mode==='detail'`（客戶群明細）時渲染；總覽模式即使保留分頁標籤也不顯示。

## 境外客戶報表 `<table>`（`pages/foreign_basic_report.html`，頁面專屬，未元件化）
與境內客戶報表頁（見上）共用同一套報表引擎（年度／月份展開、非整月簡化模式、排序、窄表填滿），僅資料模型與 Filter 多下列境外專屬差異；其餘行為要點同上，不重複列出。
相關設計稿狀態：主頁、Filter 選單展開、表格元件狀態總覽、凍結欄操作、前一年操作、資料操作、今年度操作、非1號開始、客戶群明細、自訂匯出報表。

- **Filter 多一欄「境外分類」**：集團戶／客戶類型／產業類別同一列由 3 欄改 4 欄，新增 `fb-dropdown[data-k="foreignCategory"]`（`type="multi" search`，英文標示 Foreign Category）；「客戶群」欄位標籤顯示為「客戶群/客戶群代號」。
- **凍結標籤欄由 4 欄改 6 欄**：`集團戶/客戶類型/產業類別/境外分類/客戶群/客戶群代號`（比照 表頭與 全展開範例）。報表 `<table>` 加 `.report--foreign` class，`assets/css/components.css` 的凍結欄分隔線規則（總覽 `.freeze.f5`／明細 `.freeze.f9`）比照境內頁的 `.freeze.f3`／`.freeze.f7` 各多推兩欄，僅在 `.report--foreign` 下生效，不影響境內頁。
- **每個產業類別都多一層可收合子群組（欄位沿用「境外分類」欄名）**：依 全展開範例還原（科技業/製造業/金融業/物流業/銀行/外資皆有，非外資獨有），`ROWS` 在「產業類別」列與「客戶群」列之間統一插入一層 `kind:'sub'`（`toggleCol:3`）子群組（如「金融機構」「銀行機構」）；「客戶類型=一般、產業類別=外資」路徑進一步拆成「外資機構」「外資基金」兩個子群組。
- **`seedCollapsed` 一併收合子群組層**：`toggleCol===2`（產業類別）與 `toggleCol===3`（子群組）的 sub 列皆預設收合。
- **客戶群／客戶群代號皆為進入明細的連結**：總覽表中，明細列（`kind:'detail'`）的「客戶群」（col index 4）與「客戶群代號」（col index 5）兩欄皆套用 `.link` 樣式並綁定 `enterDetail(row)`，點擊任一欄都會開啟該客戶群的明細分頁（drill-down）。
- **凍結標籤欄溢出文字一律截斷＋hover tooltip**：所有凍結標籤欄（含總覽表與客戶群明細表）的儲存格，只要有內容一律套用 `.truncate`（`overflow:hidden` + `ellipsis`）並設定 `title` 屬性，hover 時以瀏覽器原生 tooltip 顯示完整文字；與「客戶群／客戶群代號」連結樣式可並存。
- **匯出對話框新增「境外分類彙總」**：境外頁呼叫 `exportDlg.open({ ..., foreignMode: true })`，`fb-export-dialog`（`assets/js/components.js`）於「客戶明細層級」在「產業類別彙總」與「客戶群彙總」之間插入「境外分類彙總」選項（`expLevelsFor(foreignMode)`）；境內頁未傳 `foreignMode`，行為不變。
- **非目標**：本次未實作 Figma 顯示的「日報表」查詢模式，僅保留月報表＋非1號開始簡化模式（比照境內頁）。

## 行事曆事件清單 `<table class="cal-events">`（首頁專屬，未元件化）
`index.html` 依分段控制的分類，用 JS 建整個 `<table>`（colgroup/thead/tbody），三種 schema。表頭一律中英上下兩行（`.cal-events thead th .en` = `display:block`）、靠左對齊，與 `.cl-table` 表頭一致：
- 個人：標題 / 時間 / 備註 /（本人）操作（`編輯 Edit`·`刪除 Delete`，純文字內嵌動作，不套 `.btn-danger-line`）。上方新增鈕文字 `新增行程 Add`。
- 服務：名稱(主題) / 時間 / 類型 / 講師/研究員 / 人數 / 連結說明 /（本人）操作「新增至服務紀錄」。
- 活動：同服務，操作「轉至活動頁面」，無上方新增鈕。

相關樣式（`assets/css/components.css`）：
- `.cal-tag` / `.cal-tag--{info,success,warning,promotion,await,error}` — 對照 Figma `tag/basic`（`--radius-xs`、12/18、`--tag-bg-*` / `--tag-text-*`）
- `.cal-events__time` / `.cal-events__time-wrap` — 時間欄自動換行、不截斷
- `.cal-empty`（`.cal-empty__ic` / `__zh` / `__en`）— 無行程空狀態；搜尋圖示用 `<fb-icon name="fb-search">`
- `.btn-neutral-outline` — 中性描邊按鈕（modal 取消鈕：灰框灰字、`--line` / `--text-secondary`）
- `.btn-danger-outline` — 危險描邊按鈕（紅框紅字，用於確認對話框主動作）
- `.btn-danger-line` — 列內刪除按鈕（淺灰框 `--line` ＋ 紅字 `--color-red-550` ＋白底，hover `--color-red-040`）；`agent_settings` 清單列與代理人 Modal 底部刪除鈕沿用

## 首頁客戶列表分頁 `<table class="cl-table">`（首頁專屬，未元件化）

`index.html` 右側卡片 `fb-card-tabs` 的「客戶列表」分頁。Figma node：畫面（1920／1440／1160 三 breakpoint）、儲存格標籤。

- **分頁切換**：第二支 `<script>` IIFE 監聽 `fb-card-tabs` 的 `tab-change`，切換 `#panel-calendar` / `#panel-customer` / `#panel-notice` 的 `hidden`；`#panel-customer` 首次顯示才 `initCustomerListTab`（`custInited` 旗標），行事曆與服務通知皆由第一支 IIFE 載入即算好、`setSelected` 時一併重繪，不需額外的首次顯示旗標。JSON 分頁順序：0=客戶列表、1=行事曆（預設 active）、2=服務通知（`badge` 隨當日異動筆數即時計算）。
- **篩選**：`fb-filter-card` + 兩列 `.filter__grid.cols-3`。「總帳戶／企業戶」為關鍵字輸入 `<input class="cl-kw" id="clCorp">`（對照 Figma placeholder「請輸入關鍵字搜尋」，子字串比對）；其餘五欄為 `fb-dropdown type="multi" search`，`data-k` = `unit` / `segment` / `foreign` / `product` / `affiliate`（即資料欄位名）。`.filter__actions` 內按鈕順序為左＝「重置 Reset」＝`btn-text muted`、右＝「查詢 Search」＝`btn-text`（沿用報表頁 `.filter__actions` 版型）。條件僅按「查詢」時套用；「重置」呼叫各 `fb-dropdown.reset`（multi 預設＝全選）並清空已套用條件、頁碼歸 1。
- **查詢資訊列** `.cl-meta`：`資料日期 Data Date`（`#clDataDate`，固定字串）＋`查詢時間 Query Time`（`#clQueryTime`，`HH:MM:SS`，載入與「更新數據」時以 `new Date` 更新）；右側「更新數據 Update」＝`.btn-outline` + `fb-refresh-cw`，重跑 `render` 並更新查詢時間。
- **資料表** `.cl-table`：JS 建 `<thead>/<tbody>`，欄位＝單位／總帳戶‧企業戶／產業類別／境外分類／商品／集團戶／日成交金額（元）。表頭中英文上下擺放（`.cl-table thead th .en` = `display:block`）、一律靠左（含金額欄表頭）。`.cl-table-wrap` `max-height:448px; overflow-y:auto` + 表頭 `position:sticky`。金額欄 `.cl-col-num` 資料列右對齊、`tabular-nums`、千分位（表頭不再右對齊），總帳戶欄 `.cl-col-corp`（`--text-link`），無值顯示「—」。查無資料顯示 `.cl-empty`（沿用行事曆空狀態視覺）。
- **儲存格標籤** `.cl-tag` / `.cl-tag--{info,neutral,warning,promotion,error}`（`--radius-xs`、12/18、`--tag-bg-*` / `--tag-text-*`）。值→色對照：單位 境內＝`info`／境外＝`error`；產業類別（科技業·製造業·外資）＝`neutral`（新增 `--tag-bg-neutral` / `--tag-text-neutral` ⇐ `tag/basic/*/completed`）；境外分類 Co-Cover＝`warning`、其餘＝`info`；商品 台股＝`warning`、海外股票＝`promotion`；集團戶＝純文字。
- **分頁** `fb-pagination#clPager`：`sizes:[20,50,100]`、預設 20。`render` 每次 `setTotal(filteredLen, page)`（不派事件）後回讀 `pager.page`；`page-change` 事件更新 `page` / `pageSize` 後重繪（改每頁筆數時元件自身已將 `page` 歸 1）。
- 資料為純前端 mock（80 筆，`corp × foreign × product` 組合），無後端、無 `sessionStorage`。

## 使用者登入紀錄 `<table class="ull-table">`（`pages/user_login_logs.html` 頁內，未元件化）

Figma node：畫面（1920／1440／1160 三 breakpoint）、表頭、匯出流程（對話框）／（成功）／（失敗）。

- **組裝**：`fb-topnav` + `fb-area-title` + 滿版 `fb-tabbar`（七分頁，`active=5`；帶 `href` 的分頁由 `fb-tabbar` 自行導頁，佔位分頁 `tab-change` 擋回本頁）+ `fb-filter-card` + 動作列（`匯出 Export`＝`.btn-outline`）+ `.ull-table` + `fb-pagination`。
- **篩選**（僅按「查詢」時套用；`applied` 為 `null` 表示未套用＝顯示全部）：員工編號／員工姓名／AD 帳號／使用者 IP＝`<input class="ull-text">`（子字串比對）；登入時間(起)／(訖)、登出時間(起)／(訖)＝`fb-datetime-field`（各以 `fbLinkRange` 綁定，字串 `>=` / `<=` 比對）；登入狀態／登出方式＝`fb-dropdown`（`全部` 視為不篩、`(空白)` 對應登出方式空字串）。`.filter__actions` 內按鈕順序為左＝「重設 Reset」＝`.btn-text.muted`、右＝「查詢 Search」＝`.btn-text`。重設清空所有欄位、`fb-datetime-field` 一併清 `value`/`min`/`max`、排序回預設、頁碼歸 1。
- **表格** `.ull-table`（`table-layout:fixed`，9 欄：AD 帳號／員工姓名／員工編號／分公司代號／使用者 IP／登入時間／登入狀態／登出時間／登出方式）：表頭中英文上下擺放（`.hcell__t` / `.hcell__en`），每欄含 `.sort-ic`（`FbIcon.sort(dir)`）可點擊切換排序；套用共用 `fbSortRows`（`sortVal` 涵蓋 9 欄，時間欄以 `YYYY/MM/DD HH:MM` 字串比較）。`DEFAULT_SORT = { col:'loginAt', dir:'desc' }`（登入時間新到舊）；點欄位序：他欄→`asc`、`asc`→`desc`、`desc`→回 `DEFAULT_SORT`。空結果顯示 `.ull-empty`。
- **分頁** `fb-pagination#pager`：`sizes:[20,50,100]`、預設 20；`render` 內 `setTotal(filteredLen, pager.page)` 後切片；`page-change` 重繪。
- **匯出**：`匯出` 按鈕以當前查詢結果筆數 `open({ count, limit:2000 })` 開啟 `fb-batch-export-dialog`；監聽 `export` → 原型交替示範：奇數次 `fb-toast`「資料已匯出」（success），偶數次 `fb-toast`「資料匯出失敗」（`tone:'danger'`）；`cancel` 不顯示 toast。不產生實際檔案。
- 資料為頁面內寫死產生器（約 1,000 筆，涵蓋所有登入狀態與登出方式），無後端、無 `sessionStorage`。

## `fbSortRows` — 管理列表共用排序（`assets/js/components.js`，全域函式，非 fb-*）

所有含「狀態（啟用／停用）」欄位的管理列表（角色／使用者／組織／選單管理）皆以 `window.fbSortRows` 繪製表格，不各自實作排序比較器。

簽名：`fbSortRows(rows, { sort, sortVal, seq })` → 回傳排序後的新陣列（不改動 `rows`）。
- `rows` — 已套用篩選的來源列陣列。
- `sort` — `null` 或 `{ col, dir:'asc'|'desc' }`，即各頁既有的欄位排序狀態（點一次升冪、兩次降冪、三次回 `null`）。
- `sortVal` — 欄位名 → 取值函式；四頁皆含 `state`（`r.active ? 0 : 1`）。
- `seq` — 穩定序號的鍵名，預設 `'_seq'`。

排序優先序：
1. **啟用群組恆在上**：`active===true` 的列一律排在 `active===false` 的列之前，與是否點選欄位排序無關。
2. **群組內欄位排序**：有 `sort` 時套用該欄位比較與方向；無 `sort` 時維持來源順序。
3. **穩定最終鍵**：一律以 `seq` 由小到大 tie-break，確保停用／啟用往返後精準回到原位置、且結果可重現。

`_seq` 標記約定：各頁資料陣列載入後一次性 `arr.forEach(function (r, i) { r._seq = i; })`；新增資料時給 `Math.max(...現有 _seq) + 1`（空陣列則 `0`），確保新列排在既有列之後且不重複。各頁 `var sort` 一律預設 `null`（停用置底改由本函式第 1 段保證，不再靠 `{ col:'state' }` 預設值）。

行為變更備註：
- **角色管理／選單管理**：預設檢視（未點欄位排序）由「維持插入順序」改為「停用列一律置底」。停用列在停用群組內、啟用列在啟用群組內，皆維持 `_seq` 順序。
- **組織管理**：移除 `sortedRows` 內忽略排序方向的 `createdAt` 隱藏 tie-break；`ORGS` 種子陣列已改排成先前預設檢視的呈現順序（同群創建日期新到舊、停用列在後），標記 `_seq` 後由 `fbSortRows` 穩定重現，預設檢視外觀不變。
- **使用者管理／組織管理**：`DEFAULT_SORT` 由 `{ col:'state', dir:'asc' }` 改為 `null`；欄位排序點第三次回到 `null`（與角色／選單管理一致）。

## `fbLinkRange` — 起訖欄位聯動（`assets/js/components.js`，全域函式，非 fb-*）

`fbLinkRange(startEl, endEl, { kind })` 綁定一組「起／訖」`fb-date-field`、`fb-time-field` 或 `fb-datetime-field`，使其相互約束、UI 上即無法選出「訖早於起」（三者 `value` 皆為可字典序比較的固定格式字串）：
- 監聽 `startEl` 的 `change` → `endEl.min = startEl.value`；若此時訖值早於新起值，將訖值一併推移至起值（並在 `endEl` 上補派 `change`），使「訖不早於起」而不鎖死起欄位
- 監聽 `endEl` 的 `change` → `startEl.max = endEl.value`（推移造成的 `change` 不觸發此收斂，僅使用者主動調整訖值時才收斂起值上界）
- 呼叫時只立即套用下界（`endEl.min`）；不以預填的訖值回設 `startEl.max`，避免起訖預填等值時起欄位選不到未來
- `kind`（`'date'` | `'time'` | `'datetime'`）目前僅作語意標記

使用點：
- `fb-schedule-dialog`（元件內部自綁，見上）。
- **使用者登入紀錄搜尋列**（`pages/user_login_logs.html`）：`登入時間(起)`／`(訖)`、`登出時間(起)`／`(訖)` 兩組 `fb-datetime-field` 各自綁定；「重設」時一併清 `value` 與 `min`/`max`。
- **境內客戶報表搜尋列**：`資料日期(起)` / `(訖)` 兩個 `fb-date-field` 綁定；按「查詢」時另在 handler 開頭比對，訖 < 起則在 `(訖)` 欄位加 `.field.is-invalid` + `.field__err` 並以 `reportToast` 提示、不重新 `build`；「重設」時一併清 `min`/`max` 與錯誤樣式。
- **代理設定 Modal**：`agStart` / `agEnd` 綁定；`refreshValidity` 內加 `badRange`（訖 < 起）判斷，顯示既有 `banner` 訊息並 `saveBtn.disabled = true`，與代理期間重疊檢查並存。

相關樣式（`assets/css/components.css`）：`.datepop__grid button.oor`（超出範圍日期格）、`.field.is-invalid .date-ctrl`／`.field__err`（搜尋列）、`.sched__field.is-invalid .date-ctrl`／`.sched__field.is-invalid .time-ctrl`／`.sched__err`（行程對話框）。

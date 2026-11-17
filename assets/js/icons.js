/* =============================================================================
 * icons.js — 圖示 registry + <fb-icon> 元件
 *
 * 傳統 script（非 ES module、不使用 fetch），可於 file:// 載入。
 * 所有 SVG 一律使用 currentColor，顏色由使用端 CSS 的 color 控制。
 * 新增圖示：只在 FB_ICONS 增加一個項目。禁止在頁面/元件散布 inline <svg>。
 *
 * 既有 index.html inline SVG 對照（見 design/components.md）：
 *   CAL_SVG      -> fb-calendar        SRCH_SVG / 搜尋框 -> fb-search
 *   CHV_SVG      -> fb-chevron-down     topnav 語音      -> fb-voice
 *   topnav 使用者 -> fb-user            btnReset         -> fb-reset
 *   btnExport    -> fb-export           IC.plus          -> fb-plus
 *   IC.minus     -> fb-minus            BACK_SVG         -> fb-chevron-left
 *   X_SVG        -> fb-close            SORT_UP/SORT_DN  -> fb-sort / FbIcon.sort(dir)
 * ========================================================================== */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  var FB_ICONS = {
    'fb-search':
      '<svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="m14 14 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',

    'fb-voice':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 10 3Z" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M5 10a5 5 0 0 0 10 0M10 15v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',

    'fb-user':
      '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6.5" r="3" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M4.5 16.5c.9-3 3-4.5 5.5-4.5s4.6 1.5 5.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',

    'fb-reset':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 1 1 1.8 4.3M4 10V6M4 10h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    /* settings：齒輪（對照 Figma fb-settings，服務紀錄管理搜尋欄「選單項目設定 Setting」）*/
    'fb-settings':
      '<svg viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.66637C11.8408 6.66637 13.3332 8.1589 13.3333 9.9997C13.3333 11.8406 11.8409 13.333 10 13.333C8.15905 13.333 6.66667 11.8406 6.66667 9.9997C6.66684 8.1589 8.15916 6.66637 10 6.66637ZM10 8.33303C9.07963 8.33303 8.33351 9.07937 8.33333 9.9997C8.33333 10.9202 9.07953 11.6664 10 11.6664C10.9205 11.6664 11.6667 10.9202 11.6667 9.9997C11.6665 9.07937 10.9204 8.33303 10 8.33303Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.9546 2.51353C11.4149 1.71655 12.4337 1.44389 13.2308 1.904L15.3963 3.154C16.1933 3.6143 16.466 4.63312 16.0059 5.4302L15.5371 6.24237C15.5392 6.23864 15.5362 6.24084 15.5371 6.2554C15.5383 6.27213 15.5451 6.29811 15.5632 6.32538C15.7101 6.54746 15.8443 6.77895 15.9644 7.01874C15.9792 7.0483 15.9983 7.0679 16.0124 7.07734C16.0177 7.08092 16.0217 7.08232 16.0238 7.08303H16.6667C17.587 7.08303 18.3332 7.82937 18.3333 8.7497V11.2497C18.3333 12.1702 17.5871 12.9164 16.6667 12.9164H16.0238C16.0282 12.9164 16.0247 12.9147 16.0124 12.9229C15.9984 12.9323 15.9791 12.9513 15.9644 12.9807C15.8442 13.2206 15.7102 13.4526 15.5632 13.6748C15.5451 13.7021 15.5383 13.7281 15.5371 13.7448C15.5362 13.7593 15.5392 13.7615 15.5371 13.7578L16.0059 14.57C16.4661 15.3672 16.1935 16.3868 15.3963 16.847L13.2308 18.097C12.4337 18.557 11.4148 18.2837 10.9546 17.4867L10.485 16.6737C10.4872 16.6775 10.4876 16.6737 10.4744 16.6672C10.4594 16.6598 10.4332 16.653 10.4004 16.655C10.2678 16.6628 10.1343 16.6664 10 16.6664C9.86567 16.6664 9.73216 16.6628 9.59961 16.655C9.56686 16.653 9.54058 16.6598 9.52555 16.6672C9.51241 16.6737 9.51279 16.6775 9.51497 16.6737L9.04541 17.4867C8.58523 18.2836 7.56627 18.5569 6.76921 18.097L4.60368 16.847C3.80659 16.3868 3.53324 15.3671 3.99333 14.57L4.46289 13.7578C4.46085 13.7615 4.46384 13.7593 4.46289 13.7448C4.46174 13.7281 4.45489 13.7021 4.43685 13.6748C4.28983 13.4526 4.15576 13.2206 4.03564 12.9807C4.0209 12.9513 4.00164 12.9323 3.98763 12.9229C3.97532 12.9147 3.97181 12.9164 3.97624 12.9164H3.33333C2.41286 12.9164 1.66667 12.1702 1.66667 11.2497V8.7497C1.66683 7.82937 2.41296 7.08303 3.33333 7.08303H3.97624C3.97825 7.08232 3.98227 7.08091 3.98763 7.07734C4.00169 7.0679 4.02084 7.0483 4.03564 7.01874C4.1557 6.77897 4.28992 6.54745 4.43685 6.32538C4.45487 6.2981 4.46174 6.27212 4.46289 6.2554C4.46384 6.24086 4.46078 6.23867 4.46289 6.24237L3.99333 5.4302C3.5334 4.63316 3.80679 3.61422 4.60368 3.154L6.76921 1.904C7.56626 1.44393 8.58514 1.7166 9.04541 2.51353L9.51497 3.32652C9.51666 3.32792 9.52017 3.32955 9.52555 3.33222C9.54052 3.33962 9.56619 3.34712 9.5988 3.34524C9.7315 3.33735 9.86551 3.33303 10 3.33303C10.1345 3.33303 10.2685 3.33736 10.4012 3.34524C10.4338 3.34711 10.4595 3.33961 10.4744 3.33222C10.4798 3.32955 10.4833 3.32791 10.485 3.32652L10.9546 2.51353ZM11.9287 4.15986C11.5762 4.77013 10.9143 5.04503 10.3019 5.00865C10.2021 5.00272 10.1015 4.9997 10 4.9997C9.89854 4.9997 9.79786 5.00272 9.69808 5.00865C9.08573 5.04504 8.4238 4.77012 8.07129 4.15986L7.60254 3.34687L5.43701 4.59687L5.90576 5.40904C6.25878 6.02049 6.1657 6.73267 5.82682 7.24498C5.71654 7.41165 5.61568 7.58531 5.52572 7.765C5.25115 8.31342 4.68199 8.74969 3.97624 8.7497H3.33333V11.2497H3.97624C4.68199 11.2497 5.25115 11.6868 5.52572 12.2352C5.61568 12.4149 5.71654 12.5886 5.82682 12.7552C6.16572 13.2675 6.25879 13.9797 5.90576 14.5912L5.43701 15.4033L7.60254 16.6533L8.07129 15.8404C8.42373 15.23 9.0857 14.9544 9.69808 14.9907C9.79784 14.9967 9.89856 14.9997 10 14.9997C10.1014 14.9997 10.2022 14.9967 10.3019 14.9907C10.9143 14.9544 11.5763 15.23 11.9287 15.8404L12.3975 16.6533L14.563 15.4033L14.0934 14.5912C13.7404 13.9797 13.8343 13.2675 14.1732 12.7552C14.2835 12.5886 14.3843 12.4149 14.4743 12.2352C14.7489 11.6868 15.318 11.2497 16.0238 11.2497H16.6667V8.7497H16.0238C15.318 8.74969 14.7489 8.31342 14.4743 7.765C14.3843 7.5853 14.2835 7.41166 14.1732 7.24498C13.8343 6.73267 13.7412 6.02051 14.0942 5.40904L14.563 4.59687L12.3975 3.34687L11.9287 4.15986Z" fill="currentColor"/></svg>',

    /* line-chart：折線圖趨勢圖示（對照 Figma fb-line-chart，服務紀錄管理頁「交易量 (USD)」圖例）*/
    'fb-line-chart':
      '<svg viewBox="0 0 18 18" fill="none"><path fill="currentColor" d="M14.625 12.75C15.0392 12.75 15.375 13.0858 15.375 13.5C15.3749 13.9142 15.0392 14.25 14.625 14.25H3.375C2.96083 14.25 2.62507 13.9142 2.625 13.5C2.625 13.0858 2.96079 12.75 3.375 12.75H14.625ZM14.1028 3.96167C14.4001 3.67347 14.875 3.68058 15.1633 3.97778C15.4515 4.27515 15.4444 4.75005 15.1472 5.03833L11.4932 8.57959C11.2822 8.78394 11.0958 8.96522 10.9314 9.10327C10.7623 9.24532 10.5712 9.38165 10.3359 9.46875L10.3345 9.46948C9.86629 9.64162 9.35517 9.62169 8.90112 9.41675V9.41602C8.67276 9.31316 8.49135 9.1651 8.33276 9.01245C8.17802 8.86348 8.00385 8.66959 7.80688 8.45142L7.80322 8.44775C7.59498 8.21709 7.46397 8.07249 7.35791 7.97021C7.25691 7.87285 7.21914 7.85445 7.21289 7.85156V7.85083C7.11742 7.80771 7.01622 7.8048 6.92139 7.83765H6.92065C6.91711 7.83886 6.88028 7.85168 6.77417 7.93652C6.66124 8.02686 6.52007 8.15665 6.29443 8.36499C6.29103 8.36812 6.2869 8.37071 6.28345 8.37378L3.8833 10.5894C3.57892 10.8701 3.10437 10.8512 2.82349 10.5469C2.54288 10.2425 2.56246 9.76789 2.8667 9.48706L5.27417 7.26489C5.27804 7.26132 5.28195 7.2574 5.28589 7.25391C5.49184 7.06373 5.67496 6.89475 5.83667 6.76538C6.00581 6.63009 6.19692 6.50047 6.43066 6.41968C6.83601 6.27928 7.27039 6.28179 7.67065 6.42114L7.83984 6.48926L7.84204 6.48999C8.06526 6.59309 8.24261 6.73942 8.39941 6.89062C8.55155 7.03734 8.7224 7.22713 8.9165 7.44214L8.92017 7.44653C9.13181 7.68096 9.26494 7.82754 9.3728 7.9314C9.42473 7.98139 9.46006 8.01064 9.48267 8.02734L9.51709 8.04932L9.51855 8.05005C9.61569 8.09387 9.71841 8.09693 9.81519 8.06177C9.81923 8.06027 9.85758 8.04655 9.9668 7.95483C10.081 7.85891 10.223 7.72147 10.4495 7.5022L14.1028 3.96167Z"/></svg>',

    'fb-export':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-loader':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5a7.5 7.5 0 1 1-7.5 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',

    'fb-calendar':
      '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4.5" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M3 8h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    'fb-chevron-down':
      '<svg viewBox="0 0 20 20" fill="none"><path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-chevron-left':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-chevron-right':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-trash':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6m-6 0v9a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 15 15V6M8.5 9v5M11.5 9v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-shield-alert':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5l6 2.2v4.6c0 4-2.6 6.6-6 8.2-3.4-1.6-6-4.2-6-8.2V4.7l6-2.2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 7v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="13.2" r="1" fill="currentColor"/></svg>',

    'fb-plus':
      '<svg viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    'fb-minus':
      '<svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    'fb-close':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',

    'fb-edit':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M13.5 3.5l3 3M4 16l.7-3.2 8.1-8.1a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1l-8.1 8.1L4 16Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',

    /* refresh-cw：循環雙箭頭（實心，對照 Figma fb-refresh-cw 32 / 儀表板）*/
    'fb-refresh-cw':
      '<svg viewBox="0 0 32 32" fill="none"><path fill="currentColor" d="M5.12874 14.6823C5.49794 14.625 5.87474 14.725 6.1665 14.9583L9.49984 17.625C10.0749 18.085 10.1682 18.925 9.70817 19.5C9.24815 20.075 8.40817 20.1683 7.83317 19.7083L7.23161 19.2279C8.53023 22.7977 11.9212 25.3333 15.8813 25.3333C19.4895 25.3333 22.6234 23.2313 24.1366 20.1523C24.4614 19.4917 25.2609 19.2196 25.9217 19.5443C26.5823 19.8692 26.8545 20.6687 26.5298 21.3294C24.5907 25.2746 20.5562 28 15.8813 28C10.5482 27.9999 6.05098 24.4568 4.5415 19.5898L3.77588 20.7396C3.3674 21.3522 2.53961 21.5178 1.92692 21.1094C1.3143 20.7009 1.14872 19.8731 1.55713 19.2604L4.2238 15.2604L4.30713 15.1484C4.51385 14.8993 4.80575 14.7325 5.12874 14.6823Z"/><path fill="currentColor" d="M16.0246 4C21.6996 4.00002 26.4452 7.95529 27.6821 13.2604L28.2915 12.5C28.7515 11.925 29.5915 11.8317 30.1665 12.2917C30.7415 12.7517 30.8348 13.5917 30.3748 14.1667L27.7082 17.5C27.2481 18.075 26.4082 18.1683 25.8332 17.7083L22.4998 15.0417C21.9249 14.5817 21.8316 13.7417 22.2915 13.1667C22.7515 12.5917 23.5915 12.4984 24.1665 12.9583L25.0363 13.6536C23.9981 9.6332 20.3552 6.66669 16.0246 6.66667C12.4932 6.66671 9.41713 8.63844 7.83838 11.5521C7.48742 12.1992 6.67837 12.4393 6.03109 12.0885C5.38395 11.7376 5.14392 10.9286 5.49463 10.2813C7.51979 6.54396 11.474 4.00004 16.0246 4Z"/></svg>',

    /* time：實心時鐘（對照 Figma fb-time 32 / 儀表板）*/
    'fb-time':
      '<svg viewBox="0 0 32 32" fill="none"><path fill="currentColor" d="M16 8C16.7364 8 17.3333 8.59695 17.3333 9.33333V15.5664L20.6719 17.5143C21.3079 17.8853 21.5232 18.7025 21.1523 19.3385C20.7814 19.9745 19.9642 20.1899 19.3281 19.819L15.3281 17.4857C14.9185 17.2467 14.6667 16.8076 14.6667 16.3333V9.33333C14.6667 8.59695 15.2636 8 16 8Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4ZM16 6.66667C10.8453 6.66667 6.66667 10.8453 6.66667 16C6.66667 21.1547 10.8453 25.3333 16 25.3333C21.1547 25.3333 25.3333 21.1547 25.3333 16C25.3333 10.8453 21.1547 6.66667 16 6.66667Z"/></svg>',

    /* calendar-filled：實心日曆（對照 Figma fb-calendar 32 / 儀表板）*/
    'fb-calendar-filled':
      '<svg viewBox="0 0 32 32" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M21.3333 2.66667C22.0697 2.66667 22.6667 3.26362 22.6667 4V5.33333H25.3333C27.5425 5.33333 29.3333 7.12419 29.3333 9.33333V25.3333C29.3333 27.5425 27.5425 29.3333 25.3333 29.3333H6.66667C4.45753 29.3333 2.66667 27.5425 2.66667 25.3333V9.33333C2.66667 7.12419 4.45753 5.33333 6.66667 5.33333H9.33333V4C9.33333 3.26362 9.93029 2.66667 10.6667 2.66667C11.403 2.66667 12 3.26362 12 4V5.33333H20V4C20 3.26362 20.597 2.66667 21.3333 2.66667ZM5.33333 25.3333L5.33984 25.4701C5.40829 26.1422 5.97643 26.6667 6.66667 26.6667H25.3333C26.0697 26.6667 26.6667 26.0697 26.6667 25.3333V14.6667H5.33333V25.3333ZM6.66667 8C5.93029 8 5.33333 8.59695 5.33333 9.33333V12H26.6667V9.33333C26.6667 8.59695 26.0697 8 25.3333 8H22.6667V9.33333C22.6667 10.0697 22.0697 10.6667 21.3333 10.6667C20.597 10.6667 20 10.0697 20 9.33333V8H12V9.33333C12 10.0697 11.403 10.6667 10.6667 10.6667C9.93029 10.6667 9.33333 10.0697 9.33333 9.33333V8H6.66667Z"/></svg>',

    /* file-document：實心文件（對照 Figma fb-file-document 32 / 儀表板）*/
    'fb-file-document':
      '<svg viewBox="0 0 32 32" fill="none"><path fill="currentColor" d="M21.3333 21.3333C22.0697 21.3333 22.6667 21.9303 22.6667 22.6667C22.6667 23.403 22.0697 24 21.3333 24H10.6667C9.93029 24 9.33333 23.403 9.33333 22.6667C9.33333 21.9303 9.93029 21.3333 10.6667 21.3333H21.3333Z"/><path fill="currentColor" d="M21.3333 16C22.0697 16 22.6667 16.597 22.6667 17.3333C22.6667 18.0697 22.0697 18.6667 21.3333 18.6667H10.6667C9.93029 18.6667 9.33333 18.0697 9.33333 17.3333C9.33333 16.597 9.93029 16 10.6667 16H21.3333Z"/><path fill="currentColor" d="M13.3333 10.6667C14.0697 10.6667 14.6667 11.2636 14.6667 12C14.6667 12.7364 14.0697 13.3333 13.3333 13.3333H10.6667C9.93029 13.3333 9.33333 12.7364 9.33333 12C9.33333 11.2636 9.93029 10.6667 10.6667 10.6667H13.3333Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M18.7982 1.33984C19.1035 1.3701 19.3905 1.5051 19.6094 1.72396L27.6094 9.72396C27.8594 9.97401 28 10.313 28 10.6667V26.6667C28 27.7275 27.5783 28.7446 26.8281 29.4948C26.078 30.2449 25.0609 30.6667 24 30.6667H8C6.93913 30.6667 5.92202 30.2449 5.17188 29.4948C4.42173 28.7446 4 27.7275 4 26.6667V5.33333C4 4.27247 4.42173 3.25535 5.17188 2.50521C5.92202 1.75506 6.93913 1.33333 8 1.33333H18.6667L18.7982 1.33984ZM8 4C7.64638 4 7.30734 4.14058 7.05729 4.39062C6.80724 4.64067 6.66667 4.97971 6.66667 5.33333V26.6667C6.66667 27.0203 6.80724 27.3593 7.05729 27.6094C7.30734 27.8594 7.64638 28 8 28H24C24.3536 28 24.6927 27.8594 24.9427 27.6094C25.1928 27.3593 25.3333 27.0203 25.3333 26.6667V12H18.6667C17.9303 12 17.3333 11.403 17.3333 10.6667V4H8ZM20 9.33333H23.4479L20 5.88542V9.33333Z"/></svg>',

    /* more-horizontal：分頁省略號 */
    'fb-more-horizontal':
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>',

    'fb-eye':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>',

    'fb-info':
      '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M10 9v4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="10" cy="6.4" r="1" fill="currentColor"/></svg>',

    /* 警示三角形（對照 Figma toast「fb-alert-triangle」，用於匯出對話框的警示文字）*/
    'fb-alert-triangle':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3.2 17.5 16.2a1 1 0 0 1-.9 1.5H3.4a1 1 0 0 1-.9-1.5L10 3.2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M10 8.2v3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="10" cy="14.2" r="1" fill="currentColor"/></svg>',

    /* 填滿版本：整體 currentColor，"i" 以 even-odd 挖空（透出底色）*/
    'fb-info-filled':
      '<svg viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" ' +
      'd="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM8.9 9h2.2v5.8H8.9V9Z"/></svg>',

    'fb-link':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M8.5 11.5a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M11.5 8.5a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    'fb-clock':
      '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M10 5.75V10l2.75 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    'fb-check-circle':
      '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M6.3 10.3l2.4 2.4 5-5.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    /* 填滿版：整圓 currentColor，× 以 even-odd 挖空（透出底色）— 對照 toast/icon/error*/
    'fb-close-circle':
      '<svg viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" ' +
      'd="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z M5.4 6.6 L6.6 5.4 L14.6 13.4 L13.4 14.6 Z M13.4 5.4 L14.6 6.6 L6.6 14.6 L5.4 13.4 Z"/></svg>',

    /* 填滿版：整圓 currentColor，勾以 even-odd 挖空（透出底色）— 對照 status/badge active */
    'fb-check-circle-filled':
      '<svg viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" ' +
      'd="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.78 5.62a1 1 0 0 0-1.56-1.24L8.94 10.5 7.3 8.84a1 1 0 0 0-1.42 1.42l2.44 2.44a1 1 0 0 0 1.51-.11l3.95-4.97Z"/></svg>',

    /* 追蹤 F/U 星號（空心／實心）， */
    'fb-star-outline':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.6l2.29 4.64 5.12.75-3.7 3.61.87 5.1L10 14.3l-4.58 2.4.87-5.1-3.7-3.61 5.12-.75L10 2.6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',

    'fb-star-filled':
      '<svg viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.6l2.29 4.64 5.12.75-3.7 3.61.87 5.1L10 14.3l-4.58 2.4.87-5.1-3.7-3.61 5.12-.75L10 2.6Z"/></svg>',

    /* Outlook 品牌標誌（受控例外：品牌 raster，來自設計稿  匯出的內嵌 data URI；仍走 registry）*/
    'fb-outlook':
      '<img class="fb-outlook-img" alt="Outlook" src="data:image/png;base64,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">',

    'fb-sort':
      '<svg viewBox="0 0 20 20" fill="none"><path d="M6.2497 3.33333C6.49689 3.33333 6.73184 3.44299 6.89016 3.63281L8.97349 6.13281C9.26811 6.48635 9.22038 7.01248 8.86689 7.30713C8.51335 7.60152 7.98715 7.55393 7.69257 7.20052L7.08303 6.46891V15.8333C7.08303 16.2936 6.70994 16.6667 6.2497 16.6667C5.78965 16.6664 5.41637 16.2934 5.41637 15.8333V6.46891L4.80683 7.20052C4.51215 7.55383 3.98598 7.60169 3.63251 7.30713C3.2793 7.0125 3.23154 6.48627 3.5259 6.13281L5.60924 3.63281L5.67271 3.56608C5.82695 3.41788 6.03346 3.33344 6.2497 3.33333Z" fill="currentColor"/>' +
      '<path d="M13.7505 3.33333C14.2106 3.33355 14.5838 3.70656 14.5838 4.16667V13.5311L15.1934 12.7995C15.4881 12.4462 16.0142 12.3983 16.3677 12.6929C16.7209 12.9875 16.7687 13.5137 16.4743 13.8672L14.391 16.3672C14.2327 16.557 13.9976 16.6665 13.7505 16.6667C13.5342 16.6667 13.3278 16.5821 13.1735 16.4339L13.11 16.3672L11.0267 13.8672C10.7321 13.5136 10.7798 12.9875 11.1333 12.6929C11.4869 12.3985 12.0131 12.4461 12.3076 12.7995L12.9172 13.5311V4.16667C12.9172 3.70643 13.2903 3.33333 13.7505 3.33333Z" fill="currentColor"/></svg>'
  };

  /* fb-sort 內兩個箭頭的原始 path，供表頭排序狀態動態調整 opacity 用 */
  var SORT_UP_PATH = FB_ICONS['fb-sort'].match(/<path d="([^"]+)"/g)[0].slice(9, -1);
  var SORT_DN_PATH = FB_ICONS['fb-sort'].match(/<path d="([^"]+)"/g)[1].slice(9, -1);

  function svgMarkup(name) {
    return Object.prototype.hasOwnProperty.call(FB_ICONS, name) ? FB_ICONS[name] : '';
  }

  /* 依排序狀態（'asc' | 'desc' | null）回傳 fb-sort 的 svg，箭頭以 opacity 表示方向 */
  function sortSvg(dir) {
    var up = dir === 'asc' ? 1 : dir === 'desc' ? 0.3 : 0.6;
    var dn = dir === 'desc' ? 1 : dir === 'asc' ? 0.3 : 0.6;
    return '<svg viewBox="0 0 20 20" fill="none" xmlns="' + NS + '">' +
      '<path d="' + SORT_UP_PATH + '" fill="currentColor" opacity="' + up + '"/>' +
      '<path d="' + SORT_DN_PATH + '" fill="currentColor" opacity="' + dn + '"/></svg>';
  }

  /* ---- <fb-icon name="fb-plus"> : light DOM，繼承 color ---- */
  if ('customElements' in global && !global.customElements.get('fb-icon')) {
    global.customElements.define('fb-icon', class extends HTMLElement {
      static get observedAttributes() { return ['name']; }
      connectedCallback() { this._render(); }
      attributeChangedCallback() { this._render(); }
      _render() {
        var name = this.getAttribute('name') || '';
        var svg = svgMarkup(name);
        this.innerHTML = svg;
        if (name && !svg) console.warn('[fb-icon] 未知圖示: ' + name);
      }
    });
  }

  global.FbIcon = {
    ICONS: FB_ICONS,
    svg: svgMarkup,
    sort: sortSvg,
    SORT_UP_PATH: SORT_UP_PATH,
    SORT_DN_PATH: SORT_DN_PATH
  };
})(window);

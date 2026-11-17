/* =============================================================================
 * components.js — 所有 fb-* 共用元件（Custom Elements）
 *
 * 規範（見 specs/frontend-component-system/spec.md）：
 *   - 傳統 script：無 import/export、無 fetch，可於 file:// 載入
 *   - light DOM（不使用 Shadow DOM），全域 tokens.css / components.css 自然套用
 *   - 變體與狀態一律用 HTML 屬性控制
 *   - 需搭配 icons.js（FbIcon）先行載入
 * ========================================================================== */
(function (global) {
  'use strict';

  var doc = global.document;
  var ICON = (global.FbIcon && global.FbIcon.svg) || function () { return ''; };

  /* ---- 小工具 ---- */
  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function parseJSONAttr(node, attr, fallback) {
    var raw = node.getAttribute(attr);
    if (!raw) {
      var inline = node.querySelector('script[type="application/json"]');
      raw = inline ? inline.textContent : null;
    }
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { console.warn('[fb] 無法解析 ' + attr, e); return fallback; }
  }

  /* =========================================================================
   * 底層捲動鎖定：任一全螢幕 modal／對話框開啟時鎖 body，關閉時解鎖。
   * 以計數器支援對話框互相堆疊；鎖定時補償捲軸寬度避免內容水平位移。
   * ====================================================================== */
  var _scrollLockCount = 0;
  var _scrollLockPrevPad = '';
  function lockScroll() {
    if (_scrollLockCount++ > 0) return;
    var sbw = global.innerWidth - doc.documentElement.clientWidth;
    _scrollLockPrevPad = doc.body.style.paddingRight;
    if (sbw > 0) doc.body.style.paddingRight = sbw + 'px';
    doc.documentElement.classList.add('fb-scroll-locked');
  }
  function unlockScroll() {
    if (_scrollLockCount === 0) return;
    if (--_scrollLockCount > 0) return;
    doc.documentElement.classList.remove('fb-scroll-locked');
    doc.body.style.paddingRight = _scrollLockPrevPad;
  }

  /* =========================================================================
   * 浮層開合管理（下拉、日期）：點外面關閉、開新的先關舊的
   * ====================================================================== */
  var overlays = [];   // { host, close }
  function registerOverlay(host, close) { overlays.push({ host: host, close: close }); }
  function closeAllOverlays(except) {
    overlays.forEach(function (o) { if (o.host !== except && o.host.classList.contains('open')) o.close(); });
  }
  /* 將 position:fixed 浮層貼齊觸發元素下方；下方空間不足則上翻，最後夾在視窗內。
     浮層開啟時會被移到 <body>，以脫離對話框（含 transform 造成的包含塊）的裁切。 */
  function placeOverlay(anchor, pop) {
    var m = 8, gap = 6;
    var a = anchor.getBoundingClientRect();
    var vw = doc.documentElement.clientWidth, vh = doc.documentElement.clientHeight;
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var top = a.bottom + gap;
    if (top + ph > vh - m && a.top - gap - ph >= m) top = a.top - gap - ph;
    top = Math.max(m, Math.min(top, vh - ph - m));
    var left = Math.max(m, Math.min(a.left, vw - pw - m));
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  }
  global.FbOverlays = { closeAll: closeAllOverlays, place: placeOverlay };
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('fb-dropdown') &&
        !e.target.closest('fb-date-field') &&
        !e.target.closest('fb-time-field') &&
        !e.target.closest('fb-datetime-field') &&
        !e.target.closest('fb-org-tree-select')) closeAllOverlays();
  });
  function escHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  /* 資料管轄範圍一類「多枚灰階標籤 + 超出以 +N 呈現」的共用渲染，供表格儲存格與
     fb-org-tree-select 觸發區塊共用（見 design.md 決策 3）。+N 標籤沿用全域 fb-tooltip
     （data-tip，hover 或點擊／focus 皆會顯示），data-tip 內容為完整清單。 */
  function renderOrgTags(labels, limit) {
    limit = limit || 3;
    if (!labels.length) return '';
    var shown = labels.slice(0, limit);
    var restCount = labels.length - shown.length;
    var html = shown.map(function (l) { return '<span class="org-tag">' + escHtml(l) + '</span>'; }).join('');
    if (restCount > 0) {
      html += '<button type="button" class="org-tag org-tag--more" data-tip="' + escHtml(labels.join('、')) + '">+' + restCount + '</button>';
    }
    return html;
  }
  global.FbOrgTags = { render: renderOrgTags };

  /* =========================================================================
   * <fb-icon> 由 icons.js 定義；此處不重複
   * ====================================================================== */

  /* =========================================================================
   * <fb-area-title zh="境內客戶報表" en="Domestic Client Report">
   * ====================================================================== */
  global.customElements.define('fb-area-title', class extends HTMLElement {
    connectedCallback() {
      var zh = this.getAttribute('zh') || '';
      var en = this.getAttribute('en') || '';
      var icon = this.getAttribute('icon') || '';
      this.classList.add('area-title');
      if (icon) {
        this.classList.add('area-title--with-icon');
        this.innerHTML =
          '<span class="area-title__badge">' + ICON(icon) + '</span>' +
          '<span class="area-title__text"><h1>' + zh + '</h1>' +
          '<span class="en">' + en + '</span></span>';
      } else {
        this.innerHTML = '<h1>' + zh + '</h1><span class="en">' + en + '</span>';
      }
    }
  });

  /* =========================================================================
   * <fb-status-pill state="off|on">未啟用</fb-status-pill>
   * 純呈現的膠囊狀態標籤。
   * 只有文字內容時，自動於前方補一顆 fb-link 圖示；若已含子元素則原樣保留。
   * ====================================================================== */
  global.customElements.define('fb-status-pill', class extends HTMLElement {
    static get observedAttributes() { return ['state', 'label-on', 'label-off']; }
    connectedCallback() {
      this.classList.add('status-pill');
      if (this.hasAttribute('interactive') && !this._bound) {
        this._bound = true;
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
        var emit = () => this.dispatchEvent(new CustomEvent('pill-click', {
          bubbles: true, detail: { state: this.getAttribute('state') || 'off' }
        }));
        this.addEventListener('click', emit);
        this.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emit(); }
        });
      }
      this._render();
    }
    attributeChangedCallback() { if (this.isConnected) this._render(); }
    _render() {
      var on = this.getAttribute('state') === 'on';
      this.classList.toggle('status-pill--on', on);
      this.classList.toggle('status-pill--off', !on);
      if (!this._wrapped) {
        this._wrapped = true;
        if (!this.children.length) {
          var txt = this.textContent.trim();
          var icname = this.getAttribute('icon') || 'fb-link';
          this.innerHTML = '<span class="status-pill__ic' +
            (icname !== 'fb-link' ? ' status-pill__ic--brand' : '') + '">' + ICON(icname) + '</span>' +
            '<span class="status-pill__label">' + txt + '</span>';
        }
      }
      /* 若提供 label-on / label-off，隨 state 同步 pill 文字 */
      var lbl = this.querySelector('.status-pill__label');
      var lon = this.getAttribute('label-on');
      var loff = this.getAttribute('label-off');
      if (lbl && (lon || loff)) lbl.textContent = (on ? lon : loff) || lbl.textContent;
    }
  });

  /* =========================================================================
   * <fb-topnav active="report-zone">
   * 導覽結構為設計系統固定內容；highlight 由 active 對應 li 的 data-key
   * ====================================================================== */
  var NAV = [
    { key: 'home', zh: '首頁', en: 'Home', href: 'index.html', zone: 'root' },
    { key: 'customer', zh: '客戶管理', en: 'Customer Management', children: [
      { zh: '企業客戶總覽', en: 'Enterprise Overview' },
      { zh: '個人客戶', en: 'Individual Client' }
    ]},
    { key: 'marketing', zh: '業務推廣', en: 'Business Promotion', children: [
      { zh: '服務管理', en: 'Service Management', children: [
        { zh: '服務紀錄', en: 'Service Records', href: 'service_records.html', zone: 'pages' }
      ]},
      { zh: '活動管理', en: 'Event Management', children: [
        { zh: '議題專頁', en: 'Topic Page' }
      ]}
    ]},
    { key: 'report-zone', zh: '報表中心', en: 'Report Center', children: [
      { zh: '業績分析', en: 'Performance Analysis', children: [
        { zh: '產業績效總覽', en: 'Sector Performance Overview' },
        { zh: '產業績效分析', en: 'Sector Performance Analysis' },
        { zh: '境內客戶報表', en: 'Domestic Client Report', href: 'domestic_basic_report.html', zone: 'pages' },
        { zh: '境外客戶報表', en: 'Overseas Client Report', href: 'foreign_basic_report.html', zone: 'pages' }
      ]},
      { zh: '收益管理', en: 'Revenue Management', children: [
        { zh: '業務窗口收益', en: 'Manager Revenue' },
        { zh: '業務窗口收益設定', en: 'Revenue Settings' }
      ]}
    ]},
    { key: 'tools', zh: '系統工具', en: 'System Tools', children: [
      { zh: '權限設定', en: 'Permission Settings', children: [
        { zh: '角色管理', en: 'Role Management', href: 'role_management.html', zone: 'pages' },
        { zh: '使用者管理', en: 'User Management', href: 'user_management.html', zone: 'pages' },
        { zh: '組織管理', en: 'Organization Management', href: 'organization_management.html', zone: 'pages' },
        { zh: '選單管理', en: 'Menu Management', href: 'menu_management.html', zone: 'pages' }
      ]},
      { zh: '代理人設定', en: 'Agent Settings', href: 'agent_settings.html', zone: 'pages' },
      { zh: '系統稽核軌跡', en: 'Audit Trail', children: [
        { zh: '使用者登入紀錄', en: 'User Login Logs', href: 'user_login_logs.html', zone: 'pages' },
        { zh: '使用者軌跡查詢', en: 'User Activity Logs', href: 'user_activity_logs.html', zone: 'pages' }
      ]}
    ]}
  ];
  /* 父層節點（有子選單、自身無 href）導向其第一個具 href 的子孫頁 */
  function firstHrefDescendant(node) {
    if (!node.children) return null;
    for (var i = 0; i < node.children.length; i++) {
      var c = node.children[i];
      if (c.href) return c;
      var deep = firstHrefDescendant(c);
      if (deep) return deep;
    }
    return null;
  }
  /* 依目前檔案位置（dev 根目錄／dev pages/／dist 單檔）解析導覽連結相對路徑 */
  function navHref(node) {
    if (!node.href) {
      var fallback = firstHrefDescendant(node);
      if (!fallback) return '#';
      node = fallback;
    }
    var p = (global.location && global.location.pathname) || '';
    var inPages = /\/pages\/[^/]*$/.test(p);
    var inDist = /\/dist\/[^/]*$/.test(p);
    if (node.zone === 'root') return (inPages ? '../' : '') + node.href;
    return (inPages || inDist ? '' : 'pages/') + node.href;
  }
  function navItem(node) {
    var hasChild = node.children && node.children.length;
    var li = '<li class="' + (hasChild ? 'has-child' : '') + '">';
    li += '<a href="' + navHref(node) + '">' + node.zh + '<span class="en">' + node.en + '</span></a>';
    if (hasChild) li += '<ul class="submenu">' + node.children.map(navItem).join('') + '</ul>';
    return li + '</li>';
  }
  global.customElements.define('fb-topnav', class extends HTMLElement {
    connectedCallback() {
      var active = this.getAttribute('active');
      var brand = this.getAttribute('brand') || '業務管理系統';
      var menu = NAV.map(function (top) {
        var hasChild = top.children && top.children.length;
        var cls = [];
        if (top.key === active) cls.push('active');
        var s = '<li class="' + cls.join(' ') + '">';
        s += '<a href="' + navHref(top) + '">' + top.zh + '<span class="en">' + top.en + '</span></a>';
        if (hasChild) s += '<ul class="submenu">' + top.children.map(navItem).join('') + '</ul>';
        return s + '</li>';
      }).join('');

      this.innerHTML =
        '<header class="topnav"><div class="topnav__inner">' +
        '<a class="brand" href="' + navHref(NAV[0]) + '">' + brand + '</a>' +
        '<ul class="navmenu">' + menu + '</ul>' +
        '<div class="topnav__search">' +
          '<span class="ic" aria-hidden="true">' + ICON('fb-search') + '</span>' +
          '<input type="text" placeholder="請輸入關鍵字">' +
          '<span class="ic" aria-hidden="true">' + ICON('fb-voice') + '</span>' +
        '</div>' +
        '<div class="topnav__user" aria-hidden="true">' + ICON('fb-user') + '</div>' +
        '</div></header>';
    }
  });

  /* =========================================================================
   * <fb-tabbar active="2"> + JSON: [{zh,en,href?}] （或 options 屬性）
   * 事件：tab-change { detail: { index } }
   * tab 帶 href 時，點擊改為導向該頁（相對路徑），不切換 active、不發事件
   * ====================================================================== */
  global.customElements.define('fb-tabbar', class extends HTMLElement {
    connectedCallback() {
      this._tabs = parseJSONAttr(this, 'tabs', []);
      this._active = parseInt(this.getAttribute('active') || '0', 10);
      this.classList.add('tabbar');
      this._render();
      this.addEventListener('click', (e) => {
        var a = e.target.closest('a[data-i]');
        if (!a) return;
        e.preventDefault();
        var i = parseInt(a.dataset.i, 10);
        var tab = this._tabs[i] || {};
        if (tab.href) { global.location.href = tab.href; return; }
        this._active = i;
        this._render();
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { index: i }, bubbles: true }));
      });
    }
    _render() {
      var self = this;
      this.innerHTML = this._tabs.map(function (t, i) {
        return '<a href="' + (t.href || '#') + '" data-i="' + i + '" class="' + (i === self._active ? 'active' : '') + '">' +
          t.zh + '<span class="en">' + t.en + '</span></a>';
      }).join('');
    }
    get active() { return this._active; }
    set active(i) { this._active = i; this._render(); }
  });

  /* =========================================================================
   * <fb-card-tabs active="1"> + JSON: [{zh,en,disabled,badge}]
   * 卡片式分頁（灰底軌、白底 active + 主色底線、左對齊固定寬）
   * badge：選填數字，>0 時於分頁文字右上角顯示紅底數字徽章
   * 方法：setBadge(index, n) — 更新單一分頁的徽章數字並重繪
   * 事件：tab-change { detail: { index } }
   *  / Tab Item  / 徽章 
   * ====================================================================== */
  global.customElements.define('fb-card-tabs', class extends HTMLElement {
    connectedCallback() {
      this._tabs = parseJSONAttr(this, 'tabs', []);
      this._active = parseInt(this.getAttribute('active') || '0', 10);
      this.classList.add('card-tabs');
      this._render();
      this.addEventListener('click', (e) => {
        var a = e.target.closest('[data-i]');
        if (!a || a.disabled) return;
        e.preventDefault();
        this._active = parseInt(a.getAttribute('data-i'), 10);
        this._render();
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { index: this._active }, bubbles: true }));
      });
    }
    _render() {
      var self = this;
      this.innerHTML = this._tabs.map(function (t, i) {
        var badge = Number(t.badge) || 0;
        return '<button type="button" data-i="' + i + '" class="card-tabs__item' +
          (i === self._active ? ' is-active' : '') + (t.disabled ? ' is-disabled' : '') + '"' +
          (t.disabled ? ' disabled' : '') + '>' +
          '<span class="card-tabs__label">' +
            '<span class="card-tabs__zh">' + t.zh + '</span>' +
            (badge > 0 ? '<span class="card-tabs__badge">' + badge + '</span>' : '') +
          '</span>' +
          '<span class="card-tabs__en">' + t.en + '</span></button>';
      }).join('');
    }
    get active() { return this._active; }
    set active(i) { this._active = i; this._render(); }
    setBadge(index, n) {
      if (!this._tabs[index]) return;
      this._tabs[index].badge = n;
      this._render();
    }
  });

  /* =========================================================================
   * <fb-side-tabs active="0"> + JSON: [{zh,en}]
   * 直式（垂直排列）分頁，供「左側分頁切換右側主要內容」版型沿用
   * 事件：tab-change { detail: { index } }
   * （服務紀錄管理 總表 客戶／研究員 側邊分頁）
   * ====================================================================== */
  global.customElements.define('fb-side-tabs', class extends HTMLElement {
    connectedCallback() {
      this._tabs = parseJSONAttr(this, 'tabs', []);
      this._active = parseInt(this.getAttribute('active') || '0', 10);
      this.classList.add('side-tabs');
      this._render();
      this.addEventListener('click', (e) => {
        var b = e.target.closest('[data-i]');
        if (!b) return;
        this._active = parseInt(b.getAttribute('data-i'), 10);
        this._render();
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { index: this._active }, bubbles: true }));
      });
      this.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var b = e.target.closest('[data-i]');
        if (!b) return;
        e.preventDefault();
        this._active = parseInt(b.getAttribute('data-i'), 10);
        this._render();
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { index: this._active }, bubbles: true }));
      });
    }
    _render() {
      var self = this;
      this.innerHTML = this._tabs.map(function (t, i) {
        return '<button type="button" data-i="' + i + '" class="side-tabs__item' +
          (i === self._active ? ' is-active' : '') + '">' +
          '<span class="side-tabs__zh">' + t.zh + '</span>' +
          '<span class="side-tabs__en">' + t.en + '</span></button>';
      }).join('');
    }
    get active() { return this._active; }
    set active(i) { this._active = i; this._render(); }
  });

  /* =========================================================================
   * <fb-segmented value="個人"> + JSON: [{value,label,disabled?}]（或 [{zh,en,disabled?}]）
   * 分段控制（灰底軌 + 白底 active），單選；disabled 項目僅顯示文字、不可點擊（比照 fb-card-tabs 的 disabled）
   * 事件：change { detail: { value } }
   * （seg-ctrl-text）／（服務紀錄管理 總表/明細）
   * ====================================================================== */
  global.customElements.define('fb-segmented', class extends HTMLElement {
    connectedCallback() {
      var raw = parseJSONAttr(this, 'items', []);
      this._items = raw.map(function (it) {
        if (it.value != null) return { value: it.value, label: it.label != null ? it.label : it.value, disabled: !!it.disabled };
        return { value: it.zh, label: (it.zh + ' ' + it.en).trim(), disabled: !!it.disabled };
      });
      this._value = this.getAttribute('value') || (this._items[0] && this._items[0].value) || '';
      this.classList.add('segmented');
      this._render();
      this.addEventListener('click', (e) => {
        var b = e.target.closest('[data-v]');
        if (!b || b.disabled) return;
        this._value = b.getAttribute('data-v');
        this._render();
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true }));
      });
    }
    _render() {
      var self = this;
      this.innerHTML = this._items.map(function (it) {
        return '<button type="button" data-v="' + it.value + '" class="segmented__item' +
          (it.value === self._value ? ' is-active' : '') + (it.disabled ? ' is-disabled' : '') + '"' +
          (it.disabled ? ' disabled' : '') + '>' + it.label + '</button>';
      }).join('');
    }
    get value() { return this._value; }
    set value(v) { this._value = v; this._render(); }
  });

  /* =========================================================================
   * <fb-filter-card> — 外殼；把既有子節點包進 .filter
   * ====================================================================== */
  global.customElements.define('fb-filter-card', class extends HTMLElement {
    connectedCallback() {
      if (this._wrapped) return;
      this._wrapped = true;
      var inner = el('section', 'filter');
      while (this.firstChild) inner.appendChild(this.firstChild);
      this.appendChild(inner);
    }
  });

  /* =========================================================================
   * <fb-dropdown type="single|multi" search placeholder="請選擇">
   *   內含 <script type="application/json">{ "options": [...], "value": ... }</script>
   *   或 options / value 屬性
   * 事件：change { detail: { value } }
   * ====================================================================== */
  global.customElements.define('fb-dropdown', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'options', null);
      // options 也可能直接是陣列（來自 options 屬性）
      var opts, value;
      if (Array.isArray(cfg)) { opts = cfg; value = null; }
      else if (cfg && cfg.options) { opts = cfg.options; value = cfg.value; }
      else { opts = []; value = null; }

      this.type = this.getAttribute('type') || 'single';
      this.searchable = this.hasAttribute('search');
      this.placeholder = this.getAttribute('placeholder') || '請選擇';
      this.options = opts;
      this._initialValue = value;

      if (this.type === 'multi') {
        this.value = Array.isArray(value) ? value.slice() : this.options.slice();
      } else {
        this.value = value != null ? value : (this.options[0] || '');
      }

      this.classList.add('dd');
      this.innerHTML = '';
      this._build();
    }

    _build() {
      var self = this;
      this.innerHTML = '';

      var btn = el('button', 'dd__control'); btn.type = 'button';
      var val = el('span', 'dd__value'); btn.appendChild(val);
      var count = el('span', 'dd__count');
      if (this.type === 'multi') btn.appendChild(count);
      var chv = el('span', 'dd__chevron', ICON('fb-chevron-down')); btn.appendChild(chv);
      this.appendChild(btn);

      var panel = el('div', 'dd__panel');
      this.appendChild(panel);

      var optsWrap;

      function syncLabel() {
        if (self.type === 'single') {
          val.textContent = self.value;
          val.classList.remove('placeholder');
        } else {
          var all = self.value.length === self.options.length;
          val.textContent = self.value.length === 0 ? self.placeholder : all ? '全選' : self.value.join(', ');
          val.classList.toggle('placeholder', self.value.length === 0);
          count.textContent = self.value.length + ' / ' + self.options.length;
        }
      }

      function emit() {
        self.dispatchEvent(new CustomEvent('change', {
          detail: { value: self.type === 'multi' ? self.value.slice() : self.value },
          bubbles: true
        }));
      }

      function renderOpts(q) {
        q = q || '';
        optsWrap.innerHTML = '';
        if (self.type === 'multi') {
          var allRow = el('label', 'dd__opt');
          var allChk = doc.createElement('input'); allChk.type = 'checkbox';
          allChk.checked = self.value.length === self.options.length;
          allChk.addEventListener('change', function () {
            self.value = allChk.checked ? self.options.slice() : [];
            syncLabel(); renderOpts(q); emit();
          });
          allRow.appendChild(allChk);
          allRow.appendChild(Object.assign(doc.createElement('span'), { textContent: '全選' }));
          optsWrap.appendChild(allRow);
        }
        self.options.filter(function (o) {
          return String(o).toLowerCase().indexOf(q.toLowerCase()) !== -1;
        }).forEach(function (o) {
          var row = el(self.type === 'multi' ? 'label' : 'div',
            'dd__opt' + (self.type === 'single' && self.value === o ? ' selected' : ''));
          if (self.type === 'multi') {
            var chk = doc.createElement('input'); chk.type = 'checkbox';
            chk.checked = self.value.indexOf(o) !== -1;
            chk.addEventListener('change', function () {
              if (chk.checked) self.value.push(o);
              else self.value = self.value.filter(function (x) { return x !== o; });
              syncLabel();
              var a = optsWrap.querySelector('.dd__opt input');
              if (a) a.checked = self.value.length === self.options.length;
              emit();
            });
            row.appendChild(chk);
            row.appendChild(Object.assign(doc.createElement('span'), { textContent: o }));
          } else {
            row.appendChild(Object.assign(doc.createElement('span'), { textContent: o }));
            row.addEventListener('click', function () { self.value = o; syncLabel(); close(); emit(); });
          }
          optsWrap.appendChild(row);
        });
      }

      function buildPanel() {
        panel.innerHTML = '';
        if (self.searchable) {
          var s = el('div', 'dd__search', ICON('fb-search') + '<input type="text" placeholder="請輸入關鍵字">');
          s.querySelector('input').addEventListener('input', function (e) { renderOpts(e.target.value); });
          panel.appendChild(s);
        }
        optsWrap = doc.createElement('div');
        panel.appendChild(optsWrap);
        renderOpts('');
      }

      function open() { closeAllOverlays(self); self.classList.add('open'); buildPanel(); }
      function close() { self.classList.remove('open'); }
      btn.addEventListener('click', function () { self.classList.contains('open') ? close() : open(); });
      registerOverlay(this, close);

      this._close = close;
      this._syncLabel = syncLabel;
      syncLabel();
    }

    reset() {
      if (this.type === 'multi') {
        this.value = Array.isArray(this._initialValue) ? this._initialValue.slice() : this.options.slice();
      } else {
        this.value = this._initialValue != null ? this._initialValue : (this.options[0] || '');
      }
      if (this._syncLabel) this._syncLabel();
      if (this._close) this._close();
    }
  });

  /* =========================================================================
   * <fb-org-tree-select placeholder="請選擇 (可多選)">
   *   內含 <script type="application/json">{ "tree":[{key,zh,children:[{key,zh}]}], "value":[...] }</script>
   *   組織樹狀複選下拉：搜尋、全選、顯示已選取、展開/收合、父子節點連動與 indeterminate。
   *   值為 key 陣列：父節點下全部子節點皆選取時，值僅存父節點 key（見 design.md 決策 2）。
   *   停用／唯讀：沿用既有頁面對 fb-dropdown 的作法，外部以 inline style
   *   （pointer-events:none; opacity:0.6）處理，元件本身不內建 disabled 屬性。
   *   方法：getSelection() / setSelection(list)　事件：change { detail: { value } }
   *   
   * ====================================================================== */
  global.customElements.define('fb-org-tree-select', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'data', null);
      this._tree = (cfg && Array.isArray(cfg.tree)) ? cfg.tree : [];
      this._value = (cfg && Array.isArray(cfg.value)) ? cfg.value.slice() : [];
      this._initialValue = this._value.slice();
      this._query = '';
      this._showSelOnly = false;
      this._collapsed = {};
      this.placeholder = this.getAttribute('placeholder') || '請選擇 (可多選)';
      this.classList.add('ots');
      this._build();
    }

    /* ---- 資料查找 ---- */
    /* 顯示用標籤：一律展開為最小階層（葉節點）名稱；父節點 key（代表整部）展開為其下所有科別 */
    _displayLabels() {
      var self = this;
      var out = [];
      this._value.forEach(function (key) {
        var p = self._tree.filter(function (x) { return x.key === key; })[0];
        if (p) {
          var kids = p.children || [];
          if (kids.length) kids.forEach(function (c) { out.push(c.zh); });
          else out.push(p.zh);
        } else {
          out.push(self._labelOf(key));
        }
      });
      return out;
    }
    _labelOf(key) {
      for (var i = 0; i < this._tree.length; i++) {
        var p = this._tree[i];
        if (p.key === key) return p.zh;
        var kids = p.children || [];
        for (var j = 0; j < kids.length; j++) if (kids[j].key === key) return kids[j].zh;
      }
      return key;
    }
    _childCount(p) { return (p.children || []).length; }
    _selectedChildCount(p) {
      var val = this._value;
      return (p.children || []).filter(function (c) { return val.indexOf(c.key) !== -1; }).length;
    }
    _parentState(p) {
      if (this._value.indexOf(p.key) !== -1) return 'full';
      var total = this._childCount(p);
      if (!total) return 'none';
      var n = this._selectedChildCount(p);
      if (n === 0) return 'none';
      return n === total ? 'full' : 'partial';
    }
    _childSelected(p, c) {
      return this._value.indexOf(p.key) !== -1 || this._value.indexOf(c.key) !== -1;
    }
    _allChecked() {
      var self = this;
      return this._tree.length > 0 && this._tree.every(function (p) { return self._parentState(p) === 'full'; });
    }

    /* ---- 變更值 ---- */
    _setValue(val) {
      this._value = val;
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value.slice() }, bubbles: true }));
      this._syncTrigger();
      if (this.classList.contains('open')) this._renderTree();
    }
    _toggleParent(p, checked) {
      var val = this._value.slice();
      (p.children || []).forEach(function (c) {
        var i = val.indexOf(c.key); if (i !== -1) val.splice(i, 1);
      });
      var pi = val.indexOf(p.key); if (pi !== -1) val.splice(pi, 1);
      if (checked) val.push(p.key);
      this._setValue(val);
    }
    _toggleChild(p, c, checked) {
      var val = this._value.slice();
      var pFull = val.indexOf(p.key) !== -1;
      if (pFull) {
        val.splice(val.indexOf(p.key), 1);
        (p.children || []).forEach(function (k) { if (k.key !== c.key) val.push(k.key); });
      } else {
        var idx = val.indexOf(c.key);
        if (checked && idx === -1) val.push(c.key);
        if (!checked && idx !== -1) val.splice(idx, 1);
      }
      var kids = p.children || [];
      var allIn = kids.length > 0 && kids.every(function (k) { return val.indexOf(k.key) !== -1; });
      if (allIn) {
        kids.forEach(function (k) { var i = val.indexOf(k.key); if (i !== -1) val.splice(i, 1); });
        if (val.indexOf(p.key) === -1) val.push(p.key);
      }
      this._setValue(val);
    }
    _toggleAll(checked) {
      this._setValue(checked ? this._tree.map(function (p) { return p.key; }) : []);
    }

    get tree() { return this._tree; }
    set tree(t) {
      this._tree = Array.isArray(t) ? t : [];
      this._syncTrigger();
      if (this.classList.contains('open')) this._renderTree();
    }

    getSelection() { return this._value.slice(); }
    setSelection(list) {
      this._value = Array.isArray(list) ? list.slice() : [];
      this._syncTrigger();
      if (this.classList.contains('open')) this._renderTree();
    }
    reset() {
      this._value = this._initialValue.slice();
      this._syncTrigger();
      if (this.classList.contains('open')) this._renderTree();
    }

    /* ---- 觸發區塊：純文字、逗號分隔，超出欄寬以 ... 截斷（不用標籤呈現）；一律顯示最小階層單位 ---- */
    _syncTrigger() {
      var labels = this._displayLabels();
      if (!labels.length) {
        this._val.classList.add('placeholder');
        this._val.textContent = this.placeholder;
      } else {
        this._val.classList.remove('placeholder');
        this._val.textContent = labels.join(', ');
      }
    }

    /* ---- 面板：搜尋過濾後的可見節點 ---- */
    _visible() {
      var q = this._query.trim().toLowerCase();
      var self = this;
      return this._tree.map(function (p) {
        var pMatch = !q || p.zh.toLowerCase().indexOf(q) !== -1;
        var kids = (p.children || []).filter(function (c) {
          if (q && !pMatch && c.zh.toLowerCase().indexOf(q) === -1) return false;
          if (self._showSelOnly && !self._childSelected(p, c)) return false;
          return true;
        });
        var state = self._parentState(p);
        if (self._showSelOnly && state === 'none') return null;
        if (q && !pMatch && kids.length === 0) return null;
        return { p: p, kids: kids, state: state };
      }).filter(Boolean);
    }

    _renderTree() {
      var self = this;
      var rows = this._visible();
      if (!rows.length) {
        this._tree_el.innerHTML = '<div class="ots__empty">查無符合的組織節點</div>';
        return;
      }
      this._tree_el.innerHTML = rows.map(function (r) {
        var collapsed = !!self._collapsed[r.p.key];
        var stateCls = r.state === 'full' ? ' is-on' : r.state === 'partial' ? ' is-indeterminate' : '';
        var caret = self._childCount(r.p)
          ? '<button type="button" class="ots__caret' + (collapsed ? ' is-collapsed' : '') + '" data-caret="' + escHtml(r.p.key) + '">' + ICON('fb-chevron-down') + '</button>'
          : '<span class="ots__caret ots__caret--none"></span>';
        var childrenHtml = r.kids.map(function (c) {
          var on = self._childSelected(r.p, c);
          return '<div class="ots__node ots__node--child">' +
            '<span class="perm-chk' + (on ? ' is-on' : '') + '" tabindex="0" role="checkbox" aria-checked="' + on + '" data-chk="child" data-pkey="' + escHtml(r.p.key) + '" data-key="' + escHtml(c.key) + '"><span class="perm-chk__box"></span></span>' +
            '<span class="ots__label">' + escHtml(c.zh) + '</span>' +
            '</div>';
        }).join('');
        return '<div class="ots__node ots__node--parent">' +
          caret +
          '<span class="perm-chk' + stateCls + '" tabindex="0" role="checkbox" aria-checked="' + (r.state === 'full') + '" data-chk="parent" data-key="' + escHtml(r.p.key) + '"><span class="perm-chk__box"></span></span>' +
          '<span class="ots__label">' + escHtml(r.p.zh) + '</span>' +
          '</div>' +
          '<div class="ots__children' + (collapsed ? ' is-collapsed' : '') + '" data-children-of="' + escHtml(r.p.key) + '">' + childrenHtml + '</div>';
      }).join('');
    }

    _build() {
      var self = this;
      this.innerHTML = '';

      var btn = el('button', 'ots__control'); btn.type = 'button';
      this._val = el('span', 'ots__value');
      btn.appendChild(this._val);
      var chv = el('span', 'ots__chevron', ICON('fb-chevron-down')); btn.appendChild(chv);
      this.appendChild(btn);
      this._syncTrigger();

      var panel = el('div', 'ots__panel');
      panel.innerHTML =
        '<div class="ots__search">' + ICON('fb-search') + '<input type="text" placeholder="請輸入關鍵字"></div>' +
        '<div class="ots__toolbar">' +
          '<label class="ots__all"><input type="checkbox" data-allchk> 全選</label>' +
          '<label class="ots__showsel"><span>顯示已選取</span>' +
            '<span class="toggle" data-showsel><span class="toggle__switch"><span class="toggle__knob"></span></span></span>' +
          '</label>' +
        '</div>' +
        '<div class="ots__tree"></div>';
      this.appendChild(panel);
      this._panel = panel;
      this._tree_el = panel.querySelector('.ots__tree');
      this._allChkEl = panel.querySelector('[data-allchk]');
      this._showSelEl = panel.querySelector('[data-showsel]');
      /* 阻止冒泡：勾選會同步重建 .ots__tree 內容，使 e.target 脫離原本的祖先鏈，
         冒泡到 document 時 closest('fb-org-tree-select') 會失效而誤觸發 closeAllOverlays() */
      panel.addEventListener('click', function (e) { e.stopPropagation(); });

      /* 面板開啟時移至 <body> 並以 position:fixed 定位（沿用 fb-date-field 的 .datepop 手法），
         脫離 modal 等 overflow:hidden 祖先的裁切，不需捲動即可完整看到選單 */
      function reposition() { if (self.classList.contains('open')) placeOverlay(self, panel); }
      /* Esc 監聽掛在 document 的 capture 階段：面板開啟時已被搬到 <body>，不保證此刻
         焦點落在面板內（因此無法只靠面板自身冒泡攔截），且 fb-modal 是在 document 的
         bubble 階段關閉自己，capture 階段先攔截並 stopPropagation 可確保只關閉本選單而不誤關 Modal */
      function onEsc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
      function open() {
        closeAllOverlays(self);
        self._query = ''; self._showSelOnly = false;
        panel.querySelector('.ots__search input').value = '';
        self._showSelEl.classList.remove('is-on');
        self._allChkEl.checked = self._allChecked();
        self._renderTree();
        self.classList.add('open');
        doc.body.appendChild(panel);
        panel.classList.add('is-open');
        placeOverlay(self, panel);
        global.addEventListener('scroll', reposition, true);
        global.addEventListener('resize', reposition);
        doc.addEventListener('keydown', onEsc, true);
      }
      function close() {
        self.classList.remove('open');
        panel.classList.remove('is-open');
        if (panel.parentNode !== self) self.appendChild(panel);
        global.removeEventListener('scroll', reposition, true);
        global.removeEventListener('resize', reposition);
        doc.removeEventListener('keydown', onEsc, true);
      }
      btn.addEventListener('click', function () { self.classList.contains('open') ? close() : open(); });
      registerOverlay(this, close);
      this._close = close;

      panel.querySelector('.ots__search input').addEventListener('input', function (e) {
        self._query = e.target.value; self._renderTree();
      });
      this._allChkEl.addEventListener('change', function () { self._toggleAll(self._allChkEl.checked); });
      this._showSelEl.addEventListener('click', function () {
        self._showSelOnly = !self._showSelOnly;
        self._showSelEl.classList.toggle('is-on', self._showSelOnly);
        self._renderTree();
      });

      this._tree_el.addEventListener('click', function (e) {
        var caret = e.target.closest('[data-caret]');
        if (caret) {
          var k = caret.getAttribute('data-caret');
          self._collapsed[k] = !self._collapsed[k];
          self._renderTree();
          return;
        }
        var chk = e.target.closest('[data-chk]');
        if (chk) { self._onChk(chk); return; }
      });
      this._tree_el.addEventListener('keydown', function (e) {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        var chk = e.target.closest('[data-chk]');
        if (chk) { e.preventDefault(); self._onChk(chk); }
      });
    }

    _onChk(chk) {
      var key = chk.getAttribute('data-key');
      if (chk.getAttribute('data-chk') === 'parent') {
        var p = this._tree.filter(function (x) { return x.key === key; })[0];
        if (p) this._toggleParent(p, this._parentState(p) !== 'full');
      } else {
        var pkey = chk.getAttribute('data-pkey');
        var pp = this._tree.filter(function (x) { return x.key === pkey; })[0];
        if (!pp) return;
        var c = (pp.children || []).filter(function (x) { return x.key === key; })[0];
        if (c) this._toggleChild(pp, c, !this._childSelected(pp, c));
      }
      this._allChkEl.checked = this._allChecked();
    }
  });

  /* =========================================================================
   * <fb-date-field value="2025/01/01">
   * 事件：change { detail: { value } }
   * ====================================================================== */
  var WK = ['日', '一', '二', '三', '四', '五', '六'];
  var WK_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function pad2(n) { return String(n).padStart(2, '0'); }
  function fmtDate(d) { return d.getFullYear() + '/' + pad2(d.getMonth() + 1) + '/' + pad2(d.getDate()); }
  function parseYMD(s) { var a = s.split('/').map(Number); return new Date(a[0], a[1] - 1, a[2]); }

  function dfBound(v) {
    if (v == null || v === '') return null;
    if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
    var d = parseYMD(String(v));
    return isNaN(d.getTime()) ? null : d;
  }

  global.customElements.define('fb-date-field', class extends HTMLElement {
    static get observedAttributes() { return ['min', 'max']; }
    attributeChangedCallback(name, _old, val) {
      this['_' + name] = dfBound(val);
      if (this._built && this._redraw) this._redraw();
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var self = this;
      if (this._min === undefined) this._min = dfBound(this.getAttribute('min'));
      if (this._max === undefined) this._max = dfBound(this.getAttribute('max'));
      var initial = this.getAttribute('value') || fmtDate(new Date());
      this._initial = initial;
      this.classList.add('date-ctrl');
      this.innerHTML = '<input type="text" value="' + initial + '" readonly>' +
        '<span class="cal">' + ICON('fb-calendar') + '</span>';
      var input = this.querySelector('input');
      function inRange(d) {
        return (!self._min || d >= self._min) && (!self._max || d <= self._max);
      }

      var selected = parseYMD(input.value);
      var view = new Date(selected.getFullYear(), selected.getMonth(), 1);
      var draft = new Date(selected);

      var pop = el('div', 'datepop');
      this.appendChild(pop);

      function draw() {
        var y = view.getFullYear(), m = view.getMonth();
        var first = new Date(y, m, 1);
        var start = new Date(y, m, 1 - first.getDay());
        var grid = '';
        for (var i = 0; i < 42; i++) {
          var cur = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          var out = cur.getMonth() !== m;
          var oor = !out && !inRange(cur);
          var we = cur.getDay() === 0 || cur.getDay() === 6;
          var sel = !out && !oor && cur.toDateString() === draft.toDateString();
          grid += '<button type="button" data-d="' + cur.getFullYear() + '-' + cur.getMonth() + '-' + cur.getDate() + '"' +
            (out ? ' class="out" disabled'
                 : oor ? ' class="oor" disabled'
                 : (' class="' + (sel ? 'sel' : '') + (we && !sel ? ' we' : '') + '"')) +
            '>' + cur.getDate() + '</button>';
        }
        pop.innerHTML =
          '<div class="datepop__hd">' +
          '<button type="button" data-nav="-1">‹</button>' +
          '<span class="datepop__title">' + y + '年 ' + (m + 1) + '月</span>' +
          '<button type="button" data-nav="1">›</button></div>' +
          '<div class="datepop__wk">' + WK.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
          '<div class="datepop__grid">' + grid + '</div>' +
          '<div class="datepop__ft"><button type="button" class="clear">清除</button>' +
          '<button type="button" class="ok">確認</button></div>';
      }
      function reposition() { if (self.classList.contains('open')) placeOverlay(self, pop); }
      function open() {
        closeAllOverlays(self);
        draft = new Date(selected);
        view = new Date(selected.getFullYear(), selected.getMonth(), 1);
        draw();
        doc.body.appendChild(pop);
        pop.classList.add('is-open');
        self.classList.add('open');
        placeOverlay(self, pop);
        global.addEventListener('scroll', reposition, true);
        global.addEventListener('resize', reposition);
      }
      function close() {
        self.classList.remove('open');
        pop.classList.remove('is-open');
        if (pop.parentNode !== self) self.appendChild(pop);
        global.removeEventListener('scroll', reposition, true);
        global.removeEventListener('resize', reposition);
      }

      this.addEventListener('click', function (e) {
        if (e.target.closest('.datepop')) return;
        self.classList.contains('open') ? close() : open();
      });
      pop.addEventListener('click', function (e) {
        /* 阻止冒泡：draw() 會重建 pop 內容使 e.target 脫離 DOM，
           否則冒泡到 host / document 時 closest('.datepop') 失效而誤關閉浮層 */
        e.stopPropagation();
        var nav = e.target.closest('[data-nav]');
        if (nav) { view.setMonth(view.getMonth() + Number(nav.dataset.nav)); draw(); return; }
        var day = e.target.closest('[data-d]');
        if (day && !day.disabled) {
          var p = day.dataset.d.split('-').map(Number);
          draft = new Date(p[0], p[1], p[2]); draw(); return;
        }
        if (e.target.closest('.clear')) { draft = new Date(selected); close(); return; }
        if (e.target.closest('.ok')) {
          if (!inRange(draft)) return;                  // 草稿超出 min/max：不接受、不關閉、不派發
          selected = new Date(draft); input.value = fmtDate(selected); close();
          self.dispatchEvent(new CustomEvent('change', { detail: { value: input.value }, bubbles: true }));
          return;
        }
      });
      registerOverlay(this, close);
      this._close = close;
      this._redraw = function () { if (self.classList.contains('open')) draw(); };
      this._resetDate = function () {
        selected = parseYMD(self._initial);
        input.value = fmtDate(selected);
        close();
      };
    }
    get value() { return this.querySelector('input').value; }
    set value(v) {
      if (v == null || v === '') return;
      this._initial = String(v);
      if (this._resetDate) this._resetDate();          // 由 _initial 同步 selected 與 input
      else { var i = this.querySelector('input'); if (i) i.value = String(v); }
    }
    get min() { return this._min ? fmtDate(this._min) : ''; }
    set min(v) { this._min = dfBound(v); if (this._redraw) this._redraw(); }
    get max() { return this._max ? fmtDate(this._max) : ''; }
    set max(v) { this._max = dfBound(v); if (this._redraw) this._redraw(); }
    reset() { if (this._resetDate) this._resetDate(); }
  });

  /* =========================================================================
   * <fb-time-field value="09:00">
   * 事件：change { detail: { value } }（每次步進即時派發，值格式 HH:MM 24 小時制）
   * （時間選單）
   * ====================================================================== */
  function parseHM(s) {
    var a = String(s == null ? '' : s).split(':');
    var h = Math.min(23, Math.max(0, parseInt(a[0], 10) || 0));
    var m = Math.min(59, Math.max(0, parseInt(a[1], 10) || 0));
    return [h, m];
  }
  function fmtHM(h, m) { return pad2(h) + ':' + pad2(m); }
  function tfBound(v) {
    if (v == null || v === '') return null;
    var a = parseHM(v);
    return a[0] * 60 + a[1];
  }

  global.customElements.define('fb-time-field', class extends HTMLElement {
    static get observedAttributes() { return ['min', 'max']; }
    attributeChangedCallback(name, _old, val) {
      this[name === 'min' ? '_minM' : '_maxM'] = tfBound(val);
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var self = this;
      if (this._minM === undefined) this._minM = tfBound(this.getAttribute('min'));
      if (this._maxM === undefined) this._maxM = tfBound(this.getAttribute('max'));
      var initial = this.getAttribute('value') || '00:00';
      this._initial = initial;
      var hm = parseHM(initial);
      this._h = hm[0]; this._m = hm[1];

      this.classList.add('time-ctrl');
      this.innerHTML = '<input type="text" value="' + fmtHM(this._h, this._m) + '" readonly>' +
        '<span class="cal">' + ICON('fb-clock') + '</span>' +
        '<div class="timepop">' +
          '<button type="button" class="timepop__arw up" data-step="h:1" aria-label="時 +1">' + ICON('fb-chevron-down') + '</button>' +
          '<span></span>' +
          '<button type="button" class="timepop__arw up" data-step="m:1" aria-label="分 +1">' + ICON('fb-chevron-down') + '</button>' +
          '<span class="timepop__num" data-h>' + pad2(this._h) + '</span>' +
          '<span class="timepop__colon">:</span>' +
          '<span class="timepop__num" data-m>' + pad2(this._m) + '</span>' +
          '<button type="button" class="timepop__arw" data-step="h:-1" aria-label="時 -1">' + ICON('fb-chevron-down') + '</button>' +
          '<span></span>' +
          '<button type="button" class="timepop__arw" data-step="m:-1" aria-label="分 -1">' + ICON('fb-chevron-down') + '</button>' +
        '</div>';

      var input = this.querySelector('input');
      var pop = this.querySelector('.timepop');
      var hEl = this.querySelector('[data-h]');
      var mEl = this.querySelector('[data-m]');

      function sync(emit) {
        input.value = fmtHM(self._h, self._m);
        hEl.textContent = pad2(self._h);
        mEl.textContent = pad2(self._m);
        if (emit) self.dispatchEvent(new CustomEvent('change', { detail: { value: input.value }, bubbles: true }));
      }
      function reposition() { if (self.classList.contains('open')) placeOverlay(self, pop); }
      function open() {
        closeAllOverlays(self);
        doc.body.appendChild(pop);
        pop.classList.add('is-open');
        self.classList.add('open');
        placeOverlay(self, pop);
        global.addEventListener('scroll', reposition, true);
        global.addEventListener('resize', reposition);
      }
      function close() {
        self.classList.remove('open');
        pop.classList.remove('is-open');
        if (pop.parentNode !== self) self.appendChild(pop);
        global.removeEventListener('scroll', reposition, true);
        global.removeEventListener('resize', reposition);
      }

      this.addEventListener('click', function (e) {
        if (e.target.closest('.timepop')) return;
        self.classList.contains('open') ? close() : open();
      });
      pop.addEventListener('click', function (e) {
        e.stopPropagation();
        var btn = e.target.closest('[data-step]');
        if (!btn) return;
        var parts = btn.getAttribute('data-step').split(':');
        var d = Number(parts[1]);
        var bounded = self._minM != null || self._maxM != null;
        if (bounded) {
          // 有 min/max：以總分鐘 clamp，不迴繞
          var total = self._h * 60 + self._m + (parts[0] === 'h' ? d * 60 : d);
          var lo = self._minM != null ? self._minM : 0;
          var hi = self._maxM != null ? self._maxM : 1439;
          total = Math.max(lo, Math.min(hi, total));
          var nh = Math.floor(total / 60), nm = total % 60;
          if (nh === self._h && nm === self._m) return;   // 值未變動：不派發
          self._h = nh; self._m = nm;
        } else if (parts[0] === 'h') {
          self._h = (self._h + d + 24) % 24;
        } else {
          self._m = (self._m + d + 60) % 60;
        }
        sync(true);
      });

      registerOverlay(this, close);
      this._close = close;
      this._resetTime = function () {
        var v = parseHM(self._initial);
        self._h = v[0]; self._m = v[1];
        sync(false);
        close();
      };
    }
    get value() { return this.querySelector('input').value; }
    set value(v) {
      if (v == null || v === '') return;
      this._initial = String(v);
      if (this._resetTime) this._resetTime();
      else { var i = this.querySelector('input'); if (i) i.value = String(v); }
    }
    get min() { return this._minM != null ? fmtHM(Math.floor(this._minM / 60), this._minM % 60) : ''; }
    set min(v) { this._minM = tfBound(v); }
    get max() { return this._maxM != null ? fmtHM(Math.floor(this._maxM / 60), this._maxM % 60) : ''; }
    set max(v) { this._maxM = tfBound(v); }
    reset() { if (this._resetTime) this._resetTime(); }
  });

  /* =========================================================================
   * <fb-datetime-field value="2025/09/17 15:26" placeholder="請選擇">
   * 日期＋時間複合輸入：月曆 + 時/分微調浮層，顯示／回傳格式 YYYY/MM/DD HH:MM
   * 事件：change { detail: { value } }
   * 屬性／setter：value、min、max（皆為 YYYY/MM/DD HH:MM 字串，可字典序比較）
   * 空值時輸入框顯示 placeholder，value getter 回傳空字串
   * （date picker-使用者登錄紀錄）
   * ====================================================================== */
  function parseDT(s) {
    if (s == null || s === '') return null;
    var m = String(s).trim().match(/^(\d{4})\/(\d{2})\/(\d{2})[ T](\d{2}):(\d{2})$/);
    if (!m) return null;
    return { d: new Date(+m[1], +m[2] - 1, +m[3]), h: +m[4], mi: +m[5] };
  }
  function fmtDT(d, h, mi) { return fmtDate(d) + ' ' + pad2(h) + ':' + pad2(mi); }

  global.customElements.define('fb-datetime-field', class extends HTMLElement {
    static get observedAttributes() { return ['min', 'max']; }
    attributeChangedCallback(name, _old, val) {
      this['_' + name] = val || '';
      if (this._built && this._redraw) this._redraw();
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var self = this;
      if (this._min === undefined) this._min = this.getAttribute('min') || '';
      if (this._max === undefined) this._max = this.getAttribute('max') || '';
      this._ph = this.getAttribute('placeholder') || '請選擇';
      this._initial = this.getAttribute('value') || '';

      this.classList.add('dtfield');
      this.innerHTML = '<input type="text" readonly placeholder="' + this._ph.replace(/"/g, '&quot;') + '">' +
        '<span class="cal">' + ICON('fb-calendar') + '</span>' +
        '<div class="dtpop"></div>';
      var input = this.querySelector('input');
      var pop = this.querySelector('.dtpop');

      /* 目前已確認值（null = 空）與草稿 */
      var cur = parseDT(this._initial);
      if (cur) input.value = this._initial;
      var draft, view;

      function seedDraft() {
        var base = cur || { d: new Date(), h: 9, mi: 0 };
        draft = { d: new Date(base.d.getFullYear(), base.d.getMonth(), base.d.getDate()), h: base.h, mi: base.mi };
        view = new Date(draft.d.getFullYear(), draft.d.getMonth(), 1);
      }

      function dayInRange(dt) {
        /* 以「該日 00:00」與 min、「該日 23:59」與 max 比較，整日皆超界才禁用 */
        var lo = fmtDate(dt) + ' 00:00';
        var hi = fmtDate(dt) + ' 23:59';
        if (self._min && hi < self._min) return false;
        if (self._max && lo > self._max) return false;
        return true;
      }
      function clampToBounds(str) {
        if (self._min && str < self._min) return self._min;
        if (self._max && str > self._max) return self._max;
        return str;
      }

      function draw() {
        var y = view.getFullYear(), m = view.getMonth();
        var first = new Date(y, m, 1);
        var start = new Date(y, m, 1 - first.getDay());
        var grid = '';
        for (var i = 0; i < 42; i++) {
          var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          var out = d.getMonth() !== m;
          var oor = !out && !dayInRange(d);
          var we = d.getDay() === 0 || d.getDay() === 6;
          var sel = !out && !oor && d.toDateString() === draft.d.toDateString();
          grid += '<button type="button" data-d="' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '"' +
            (out ? ' class="out" disabled'
                 : oor ? ' class="oor" disabled'
                 : (' class="' + (sel ? 'sel' : '') + (we && !sel ? ' we' : '') + '"')) +
            '>' + d.getDate() + '</button>';
        }
        pop.innerHTML =
          '<div class="datepop__hd">' +
          '<button type="button" data-nav="-1">‹</button>' +
          '<span class="datepop__title">' + y + '年 ' + (m + 1) + '月</span>' +
          '<button type="button" data-nav="1">›</button></div>' +
          '<div class="datepop__wk">' + WK.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
          '<div class="datepop__grid">' + grid + '</div>' +
          '<div class="dtpop__time">' +
            '<span class="dtpop__time-lbl">時間 <i>Time</i></span>' +
            '<span class="dtpop__stepper">' +
              '<button type="button" class="dtpop__arw up" data-step="h:1" aria-label="時 +1">' + ICON('fb-chevron-down') + '</button>' +
              '<span class="dtpop__num" data-h>' + pad2(draft.h) + '</span>' +
              '<button type="button" class="dtpop__arw" data-step="h:-1" aria-label="時 -1">' + ICON('fb-chevron-down') + '</button>' +
            '</span>' +
            '<span class="dtpop__colon">:</span>' +
            '<span class="dtpop__stepper">' +
              '<button type="button" class="dtpop__arw up" data-step="m:1" aria-label="分 +1">' + ICON('fb-chevron-down') + '</button>' +
              '<span class="dtpop__num" data-m>' + pad2(draft.mi) + '</span>' +
              '<button type="button" class="dtpop__arw" data-step="m:-1" aria-label="分 -1">' + ICON('fb-chevron-down') + '</button>' +
            '</span>' +
          '</div>' +
          '<div class="datepop__ft"><button type="button" class="clear">清除</button>' +
          '<button type="button" class="ok">確認</button></div>';
      }

      function reposition() { if (self.classList.contains('open')) placeOverlay(self, pop); }
      function open() {
        closeAllOverlays(self);
        seedDraft(); draw();
        doc.body.appendChild(pop);
        pop.classList.add('is-open');
        self.classList.add('open');
        placeOverlay(self, pop);
        global.addEventListener('scroll', reposition, true);
        global.addEventListener('resize', reposition);
      }
      function close() {
        self.classList.remove('open');
        pop.classList.remove('is-open');
        if (pop.parentNode !== self) self.appendChild(pop);
        global.removeEventListener('scroll', reposition, true);
        global.removeEventListener('resize', reposition);
      }

      this.addEventListener('click', function (e) {
        if (e.target.closest('.dtpop')) return;
        self.classList.contains('open') ? close() : open();
      });
      pop.addEventListener('click', function (e) {
        e.stopPropagation();
        var nav = e.target.closest('[data-nav]');
        if (nav) { view.setMonth(view.getMonth() + Number(nav.dataset.nav)); draw(); return; }
        var step = e.target.closest('[data-step]');
        if (step) {
          var p = step.getAttribute('data-step').split(':');
          var dv = Number(p[1]);
          if (p[0] === 'h') draft.h = (draft.h + dv + 24) % 24;
          else draft.mi = (draft.mi + dv + 60) % 60;
          self.querySelector('[data-h]').textContent = pad2(draft.h);
          self.querySelector('[data-m]').textContent = pad2(draft.mi);
          return;
        }
        var day = e.target.closest('[data-d]');
        if (day && !day.disabled) {
          var a = day.dataset.d.split('-').map(Number);
          draft.d = new Date(a[0], a[1], a[2]); draw(); return;
        }
        if (e.target.closest('.clear')) {
          cur = null; input.value = ''; close();
          self.dispatchEvent(new CustomEvent('change', { detail: { value: '' }, bubbles: true }));
          return;
        }
        if (e.target.closest('.ok')) {
          var str = clampToBounds(fmtDT(draft.d, draft.h, draft.mi));
          cur = parseDT(str); input.value = str; close();
          self.dispatchEvent(new CustomEvent('change', { detail: { value: str }, bubbles: true }));
          return;
        }
      });
      registerOverlay(this, close);
      this._close = close;
      this._redraw = function () { if (self.classList.contains('open')) draw(); };
      this._setValue = function (v) {
        cur = parseDT(v);
        input.value = cur ? fmtDT(cur.d, cur.h, cur.mi) : '';
        close();
      };
    }
    get value() { var i = this.querySelector('input'); return (i && i.value) || ''; }
    set value(v) { this._initial = v == null ? '' : String(v); if (this._setValue) this._setValue(this._initial); }
    get min() { return this._min || ''; }
    set min(v) { this._min = v == null ? '' : String(v); if (this._redraw) this._redraw(); }
    get max() { return this._max || ''; }
    set max(v) { this._max = v == null ? '' : String(v); if (this._redraw) this._redraw(); }
    reset() { if (this._setValue) this._setValue(this.getAttribute('value') || ''); }
  });

  /* =========================================================================
   * <fb-chip active closable data-label="北辰科技, 科技業">文字</fb-chip>
   * 事件：chip-select / chip-close
   * ====================================================================== */
  global.customElements.define('fb-chip', class extends HTMLElement {
    static get observedAttributes() { return ['active', 'label']; }
    connectedCallback() { this.classList.add('chip'); this._render(); }
    attributeChangedCallback() { if (this.isConnected) this._render(); }
    _render() {
      var label = this.getAttribute('label') || this.textContent.trim();
      this._label = label;
      var closable = this.hasAttribute('closable');
      this.classList.toggle('chip--active', this.hasAttribute('active'));
      this.setAttribute('role', 'button');
      this.title = label;
      this.innerHTML = '<span class="chip__label">' + label + '</span>' +
        (closable ? '<button class="chip__x" type="button" title="關閉">' + ICON('fb-close') + '</button>' : '');
      if (!this._bound) {
        this._bound = true;
        this.addEventListener('click', (e) => {
          if (e.target.closest('.chip__x')) {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('chip-close', { bubbles: true }));
          } else {
            this.dispatchEvent(new CustomEvent('chip-select', { bubbles: true }));
          }
        });
      }
    }
  });

  /* =========================================================================
   * <fb-mini-calendar value="2026/08/24" month="2026/08">
   *   內含 <script type="application/json">{ "events": [ { "date": "2026/08/07",
   *     "kinds": ["personal","service","event"] } ] }</script>
   * 方法：setMonth(delta) / goToday() / select("YYYY/MM/DD")；getter value
   * 事件：date-change { value } / month-change { month:"YYYY/MM" }
   * （日格 ）
   * ====================================================================== */
  global.customElements.define('fb-mini-calendar', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'events', { events: [] }) || { events: [] };
      this._events = {};
      (cfg.events || []).forEach(function (e) {
        if (!e || !e.date) return;
        this._events[String(e.date).replace(/-/g, '/')] = (e.kinds || []).slice(0, 3);
      }, this);

      var initial = this.getAttribute('value') || fmtDate(new Date());
      this._selected = initial;
      var mAttr = this.getAttribute('month');
      var base = mAttr ? parseYMD(mAttr + '/01') : parseYMD(initial);
      this._view = new Date(base.getFullYear(), base.getMonth(), 1);

      this.classList.add('mini-cal');
      this._render();
      this.addEventListener('click', this._onClick.bind(this));
    }

    _onClick(e) {
      var nav = e.target.closest('[data-nav]');
      if (nav) { this.setMonth(Number(nav.getAttribute('data-nav'))); return; }
      if (e.target.closest('[data-today]')) { this.goToday(); return; }
      var cell = e.target.closest('[data-date]');
      if (cell) this.select(cell.getAttribute('data-date'));
    }

    _emitMonth() {
      this.dispatchEvent(new CustomEvent('month-change', {
        detail: { month: this._view.getFullYear() + '/' + pad2(this._view.getMonth() + 1) },
        bubbles: true
      }));
    }

    setMonth(delta) {
      this._view = new Date(this._view.getFullYear(), this._view.getMonth() + delta, 1);
      this._render();
      this._emitMonth();
    }

    goToday() {
      var t = new Date();
      this._view = new Date(t.getFullYear(), t.getMonth(), 1);
      this.select(fmtDate(t));
      this._emitMonth();
    }

    select(str) {
      this._selected = str;
      var d = parseYMD(str);
      this._view = new Date(d.getFullYear(), d.getMonth(), 1);
      this._render();
      this.dispatchEvent(new CustomEvent('date-change', { detail: { value: str }, bubbles: true }));
    }

    get value() { return this._selected; }

    /* 以新的事件清單覆蓋（[{date:"YYYY/MM/DD", kinds:[...]}]），並重繪 */
    setEvents(list) {
      this._events = {};
      (list || []).forEach(function (e) {
        if (!e || !e.date) return;
        this._events[String(e.date).replace(/-/g, '/')] = (e.kinds || []).slice(0, 3);
      }, this);
      this._render();
    }

    _render() {
      var self = this;
      var y = this._view.getFullYear(), m = this._view.getMonth();
      var today = fmtDate(new Date());
      var lead = new Date(y, m, 1).getDay();
      var dim = new Date(y, m + 1, 0).getDate();

      var cells = '';
      for (var i = 0; i < 42; i++) {
        var dnum = i - lead + 1;
        if (dnum < 1 || dnum > dim) {
          cells += '<span class="mini-cal__cell is-pad"></span>';
          continue;
        }
        var ds = y + '/' + pad2(m + 1) + '/' + pad2(dnum);
        var cls = 'mini-cal__cell';
        if (ds === today) cls += ' is-today';
        if (ds === this._selected) cls += ' is-selected';
        var dots = (this._events[ds] || []).map(function (k) {
          return '<i class="mini-cal__dot mini-cal__dot--' + k + '"></i>';
        }).join('');
        cells += '<button type="button" class="' + cls + '" data-date="' + ds + '">' +
          '<span class="mini-cal__num">' + dnum + '</span>' +
          '<span class="mini-cal__dots">' + dots + '</span></button>';
      }

      var wkRow = WK.map(function (w, i) {
        return '<span class="mini-cal__wk"><b>' + w + '</b><i>' + WK_EN[i] + '</i></span>';
      }).join('');

      this.innerHTML =
        '<div class="mini-cal__hd">' +
          '<div class="mini-cal__title"><b>' + y + ' 年 ' + (m + 1) + ' 月</b>' +
          '<span>' + MONTH_EN[m] + ' ' + y + '</span></div>' +
          '<div class="mini-cal__nav">' +
            '<button type="button" class="mini-cal__navbtn" data-nav="-1" aria-label="上一月">' + ICON('fb-chevron-left') + '</button>' +
            '<button type="button" class="mini-cal__today" data-today>今天 Today</button>' +
            '<button type="button" class="mini-cal__navbtn" data-nav="1" aria-label="下一月">' + ICON('fb-chevron-left') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mini-cal__legend">' +
          '<span><i class="mini-cal__dot mini-cal__dot--personal"></i>個人 <em>Personal</em></span>' +
          '<span><i class="mini-cal__dot mini-cal__dot--service"></i>服務 <em>Service</em></span>' +
          '<span><i class="mini-cal__dot mini-cal__dot--event"></i>活動 <em>Event</em></span>' +
        '</div>' +
        '<div class="mini-cal__wkrow">' + wkRow + '</div>' +
        '<div class="mini-cal__grid">' + cells + '</div>';
    }
  });

  /* =========================================================================
   * <fb-schedule-dialog mode="timed|allday"> — 新增／編輯行程對話框
   * 方法：open(data?) / close()；事件：submit { …欄位值 } / cancel
   * （Default / All Day）
   * ====================================================================== */
  function schedField(k, zh, en, req, type, ph, val) {
    return '<label class="sched__field for-' + k + '">' +
      '<span class="sched__lbl">' + zh + ' ' + en + (req ? ' <em>*</em>' : '') + '</span>' +
      '<input type="' + type + '" data-k="' + k + '"' +
      (ph ? ' placeholder="' + ph + '"' : '') +
      (val != null && val !== '' ? ' value="' + String(val).replace(/"/g, '&quot;') + '"' : '') +
      '></label>';
  }
  /* 日期／時間欄位改用自訂元件（fb-date-field / fb-time-field），不用原生 input[type=date|time] */
  function schedPickerField(k, zh, en, req, tag, val) {
    return '<div class="sched__field for-' + k + '">' +
      '<span class="sched__lbl">' + zh + ' ' + en + (req ? ' <em>*</em>' : '') + '</span>' +
      '<' + tag + ' data-k="' + k + '"' +
      (val != null && val !== '' ? ' value="' + String(val).replace(/"/g, '&quot;') + '"' : '') +
      '></' + tag + '></div>';
  }
  function pickEl(tag, k, val) {
    return '<' + tag + ' data-k="' + k + '"' +
      (val != null && val !== '' ? ' value="' + String(val).replace(/"/g, '&quot;') + '"' : '') +
      '></' + tag + '>';
  }
  /* 定時模式：一列同時有日期與時間（ 左側） */
  function schedDateTimeRow(k, zh, en, dateK, timeK, dateVal, timeVal) {
    return '<div class="sched__field for-' + k + '">' +
      '<span class="sched__lbl">' + zh + ' ' + en + ' <em>*</em></span>' +
      '<div class="sched__row">' +
        pickEl('fb-date-field', dateK, dateVal) +
        pickEl('fb-time-field', timeK, timeVal) +
      '</div></div>';
  }
  global.customElements.define('fb-schedule-dialog', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._allday = this.getAttribute('mode') === 'allday';
      this._vals = {};
      this._onKey = (e) => { if (e.key === 'Escape' && this.hasAttribute('open')) this._cancel(); };
      this._render();

      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-save]')) { this._save(); return; }
        if (e.target.closest('[data-cancel]') || e.target.closest('[data-close]')) { this._cancel(); }
      });
      this.addEventListener('input', (e) => {
        var t = e.target;
        if (!t.matches || !t.matches('[data-k]')) return;
        var k = t.getAttribute('data-k');
        this._vals[k] = t.type === 'checkbox' ? t.checked : t.value;
        if (k === 'notes') {
          var c = this.querySelector('.sched__counter');
          if (c) c.textContent = t.value.length + '/100';
        }
        if (k === 'title' && t.value.trim()) {
          var f = t.closest('.sched__field');
          if (f) f.classList.remove('is-invalid');
        }
      });
      this.addEventListener('change', (e) => {
        var t = e.target;
        if (!t || !t.matches) return;
        if (t.matches('[data-k="allday"]')) {
          this._allday = t.checked;
          this._vals.allday = t.checked;
          this._renderBody();
          return;
        }
        if (t.matches('fb-date-field[data-k], fb-time-field[data-k]')) {
          this._vals[t.getAttribute('data-k')] = t.value;
          var ef = this.querySelector('.sched__field.for-end.is-invalid, .sched__field.for-endDate.is-invalid');
          if (ef) {
            ef.classList.remove('is-invalid');
            var em = ef.querySelector('.sched__err');
            if (em) em.remove();
          }
        }
      });
    }

    open(data) {
      this._vals = Object.assign({}, data || {});
      this._editId = this._vals._id != null ? this._vals._id : null;
      if (typeof this._vals.allDay === 'boolean') this._allday = this._vals.allDay;
      var edit = !!this._vals._edit;
      var h3 = this.querySelector('.sched__hd h3');
      var sub = this.querySelector('.sched__hd span');
      if (h3) h3.textContent = edit ? '編輯行程' : '新增行程';
      if (sub) sub.textContent = edit ? 'Edit Schedule' : 'Add Schedule';
      if (!this.hasAttribute('open')) lockScroll();
      this.setAttribute('open', '');
      doc.addEventListener('keydown', this._onKey);
      this._renderBody();
      var t = this.querySelector('[data-k="title"]');
      if (t) t.focus();
    }
    close() {
      if (this.hasAttribute('open')) unlockScroll();
      this.removeAttribute('open');
      doc.removeEventListener('keydown', this._onKey);
      closeAllOverlays();
    }
    disconnectedCallback() {
      if (this.hasAttribute('open')) unlockScroll();
    }
    _cancel() {
      this.close();
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
    }
    _save() {
      var title = (this._vals.title || '').trim();
      if (!title) {
        var f = this.querySelector('.sched__field.for-title');
        if (f) f.classList.add('is-invalid');
        var ti = this.querySelector('[data-k="title"]');
        if (ti) ti.focus();
        return;
      }
      var d = this._vals;
      var sd = d.startDate || d.date || '', ed = d.endDate || d.date || '';
      var badRange = (sd && ed && ed < sd) ||
        (!this._allday && sd && ed && ed === sd && d.start && d.end && d.end < d.start);
      if (badRange) {
        var ef = this.querySelector('.sched__field.for-end') || this.querySelector('.sched__field.for-endDate');
        if (ef) {
          ef.classList.add('is-invalid');
          if (!ef.querySelector('.sched__err')) {
            var msg = doc.createElement('span');
            msg.className = 'sched__err';
            msg.textContent = this._allday ? '結束日期不得早於開始日期' : '結束時間不得早於開始時間';
            ef.appendChild(msg);
          }
        }
        return;
      }
      this.dispatchEvent(new CustomEvent('submit', {
        detail: {
          id: this._editId,
          title: title,
          allDay: !!this._allday,
          date: (this._allday ? d.date : (d.startDate || d.date)) || '',
          start: d.start || '',
          end: d.end || '',
          startDate: d.startDate || '',
          endDate: d.endDate || '',
          notes: d.notes || ''
        },
        bubbles: true
      }));
      this.close();
    }
    _render() {
      this.classList.add('sched');
      this.innerHTML =
        '<div class="sched__mask"></div>' +
        '<div class="sched__panel" role="dialog" aria-modal="true" aria-label="新增行程">' +
          '<button type="button" class="sched__close" data-close aria-label="關閉">' + ICON('fb-close') + '</button>' +
          '<div class="sched__hd"><h3>新增行程</h3><span>Add Schedule</span></div>' +
          '<div class="sched__body"></div>' +
          '<div class="sched__ft">' +
            '<button type="button" class="btn-neutral-outline" data-cancel>取消 Cancel</button>' +
            '<button type="button" class="btn-primary" data-save>儲存 Save</button>' +
          '</div>' +
        '</div>';
      this._renderBody();
    }
    _renderBody() {
      var body = this.querySelector('.sched__body');
      if (!body) return;
      var v = this._vals;
      var mid = this._allday
        ? schedPickerField('startDate', '開始日期', 'Start Date', true, 'fb-date-field', v.startDate) +
          schedPickerField('endDate', '結束日期', 'End Date', true, 'fb-date-field', v.endDate)
        : schedDateTimeRow('start', '開始時間', 'Start Time', 'startDate', 'start', v.startDate || v.date, v.start) +
          schedDateTimeRow('end', '結束時間', 'End Time', 'endDate', 'end', v.endDate || v.date, v.end);
      body.innerHTML =
        schedField('title', '標題', 'Title', true, 'text', '請輸入標題 (必填)', v.title) +
        mid +
        '<label class="sched__check"><input type="checkbox" data-k="allday"' +
          (this._allday ? ' checked' : '') + '>全天</label>' +
        '<label class="sched__field for-notes"><span class="sched__lbl">備註 Notes</span>' +
          '<textarea data-k="notes" maxlength="100" placeholder="請輸入">' +
          (v.notes ? String(v.notes) : '') + '</textarea>' +
          '<span class="sched__counter">' + ((v.notes || '').length) + '/100</span></label>';
      this._wireRange();
    }
    /* 綁定起訖欄位互相約束：結束日期不得早於開始日期；同日時結束時間不得早於開始時間 */
    _wireRange() {
      var sd = this.querySelector('fb-date-field[data-k="startDate"]');
      var ed = this.querySelector('fb-date-field[data-k="endDate"]');
      /* 以作用域內參考呼叫：此處在 fb-schedule-dialog 同步 upgrade 期間執行，
         global.fbLinkRange（IIFE 尾端才賦值）此刻尚為 undefined */
      if (sd && ed) fbLinkRange(sd, ed, { kind: 'date' });
      var st = this.querySelector('fb-time-field[data-k="start"]');
      var et = this.querySelector('fb-time-field[data-k="end"]');
      if (st && et) {
        var syncTimeBound = function () {
          var sameDay = sd && ed && sd.value && sd.value === ed.value;
          et.min = sameDay ? st.value : '';
          st.max = sameDay ? et.value : '';
        };
        [sd, ed, st, et].forEach(function (elm) {
          if (elm) elm.addEventListener('change', syncTimeBound);
        });
        syncTimeBound();
      }
    }
  });

  /* =========================================================================
   * <fb-confirm-dialog> — 通用確認對話框（如刪除行程）
   * 方法：open({ heading, headingEn, title, desc, confirmLabel, confirmLabelEn, tone })
   *       tone: "danger" -> 確認鈕為 .btn-danger-outline；否則 .btn-primary
   * 事件：confirm / cancel
   * （刪除行程）
   * ====================================================================== */
  global.customElements.define('fb-confirm-dialog', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._onKey = (e) => { if (e.key === 'Escape' && this.hasAttribute('open')) this._cancel(); };
      this.classList.add('confirm');
      this.innerHTML =
        '<div class="confirm__mask"></div>' +
        '<div class="confirm__panel" role="dialog" aria-modal="true">' +
          '<button type="button" class="confirm__close" data-close aria-label="關閉">' + ICON('fb-close') + '</button>' +
          '<div class="confirm__hd"><h3></h3><span></span></div>' +
          '<div class="confirm__body"><p class="confirm__title"></p><p class="confirm__desc"></p></div>' +
          '<div class="confirm__ft">' +
            '<button type="button" class="btn-neutral-outline" data-cancel></button>' +
            '<button type="button" data-confirm></button>' +
          '</div>' +
        '</div>';
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-confirm]')) {
          this.close();
          this.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
          return;
        }
        if (e.target.closest('[data-cancel]') || e.target.closest('[data-close]')) this._cancel();
      });
    }
    open(opts) {
      opts = opts || {};
      this.querySelector('.confirm__hd h3').textContent = opts.heading || '請確認';
      this.querySelector('.confirm__hd span').textContent = opts.headingEn || '';
      this.querySelector('.confirm__title').textContent = opts.title || '';
      var desc = this.querySelector('.confirm__desc');
      desc.textContent = opts.desc || '';
      desc.hidden = !opts.desc;
      this.querySelector('[data-cancel]').textContent = (opts.cancelLabel || '取消') +
        (opts.cancelLabelEn ? ' ' + opts.cancelLabelEn : ' Cancel');
      var ok = this.querySelector('[data-confirm]');
      ok.textContent = (opts.confirmLabel || '確認') +
        (opts.confirmLabelEn ? ' ' + opts.confirmLabelEn : '');
      ok.className = opts.tone === 'danger' ? 'btn-danger-outline' : 'btn-primary';
      ok.setAttribute('data-confirm', '');
      if (!this.hasAttribute('open')) lockScroll();
      this.setAttribute('open', '');
      doc.addEventListener('keydown', this._onKey);
    }
    close() {
      if (this.hasAttribute('open')) unlockScroll();
      this.removeAttribute('open');
      doc.removeEventListener('keydown', this._onKey);
    }
    disconnectedCallback() {
      if (this.hasAttribute('open')) unlockScroll();
    }
    _cancel() {
      this.close();
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
    }
  });

  /* =========================================================================
   * <fb-toast> — 右上角短暫通知
   * 方法：show(message, { tone, desc })  tone: "success"（預設）| "danger"；desc 為選填第二行說明；hide()
   * （含說明第二行）/ （danger）
   * ====================================================================== */
  global.customElements.define('fb-toast', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.classList.add('toast');
      this.hidden = true;
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) this.hide();
      });
    }
    show(message, opts) {
      opts = opts || {};
      var tone = opts.tone || 'success';
      this.className = 'toast toast--' + tone;
      var toneIcon = tone === 'danger' ? 'fb-close-circle' : 'fb-check-circle';
      this.innerHTML =
        '<span class="toast__ic">' + ICON(toneIcon) + '</span>' +
        '<span class="toast__text">' +
          '<span class="toast__msg"></span>' +
          (opts.desc ? '<span class="toast__desc"></span>' : '') +
        '</span>' +
        '<button type="button" class="toast__close" data-close aria-label="關閉">' + ICON('fb-close') + '</button>';
      this.querySelector('.toast__msg').textContent = message || '';
      if (opts.desc) this.querySelector('.toast__desc').textContent = opts.desc;
      this.hidden = false;
      clearTimeout(this._t);
      this._t = setTimeout(() => this.hide(), 3200);
    }
    hide() {
      clearTimeout(this._t);
      this.hidden = true;
    }
  });

  /* =========================================================================
   * <fb-modal heading="新增角色" heading-en="Add New Role"> — 通用 Modal 外殼
   *   遮罩 + 置中白卡 + header(標題 + ×) + 可捲 body + sticky footer
   *   light DOM 子節點：帶 data-modal-footer 的節點移入 footer，其餘移入 body
   *   方法：open() / close() / setHeading(zh, en)
   *   事件：modal-open / modal-close（× / Esc / [data-modal-cancel] 皆會關閉；點遮罩不會關閉）
   *   尺寸：寬 60vw、高 80vh、max-height 680px（見 design.md D1）；<=640px 近全螢幕
   * ====================================================================== */
  global.customElements.define('fb-modal', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._onKey = (e) => { if (e.key === 'Escape' && this.hasAttribute('open')) this.close(); };

      var footerNodes = [];
      var bodyNodes = [];
      while (this.firstChild) {
        var n = this.firstChild;
        this.removeChild(n);
        if (n.nodeType === 1 && n.hasAttribute('data-modal-footer')) footerNodes.push(n);
        else bodyNodes.push(n);
      }

      this.classList.add('modal');
      this.innerHTML =
        '<div class="modal__mask" data-modal-mask></div>' +
        '<div class="modal__panel" role="dialog" aria-modal="true">' +
          '<div class="modal__hd">' +
            '<div class="modal__title"><h3></h3><span class="modal__title-en"></span></div>' +
            '<button type="button" class="modal__close" data-modal-close aria-label="關閉">' + ICON('fb-close') + '</button>' +
          '</div>' +
          '<div class="modal__body"></div>' +
          '<div class="modal__ft"></div>' +
        '</div>';

      var body = this.querySelector('.modal__body');
      var ft = this.querySelector('.modal__ft');
      bodyNodes.forEach(function (n) { body.appendChild(n); });
      footerNodes.forEach(function (n) { ft.appendChild(n); });
      ft.hidden = footerNodes.length === 0;

      this.setHeading(this.getAttribute('heading') || '', this.getAttribute('heading-en') || '');

      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-modal-close]') ||
            e.target.closest('[data-modal-cancel]')) this.close();
      });
    }
    setHeading(zh, en) {
      var h3 = this.querySelector('.modal__title h3');
      var sp = this.querySelector('.modal__title-en');
      if (h3) h3.textContent = zh || '';
      if (sp) { sp.textContent = en || ''; sp.hidden = !en; }
    }
    open() {
      if (!this.hasAttribute('open')) lockScroll();
      this.setAttribute('open', '');
      doc.addEventListener('keydown', this._onKey);
      var b = this.querySelector('.modal__body');
      if (b) b.scrollTop = 0;
      this.dispatchEvent(new CustomEvent('modal-open', { bubbles: true }));
    }
    close() {
      if (!this.hasAttribute('open')) return;
      unlockScroll();
      this.removeAttribute('open');
      doc.removeEventListener('keydown', this._onKey);
      closeAllOverlays();
      this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }));
    }
    disconnectedCallback() {
      if (this.hasAttribute('open')) unlockScroll();
    }
    get isOpen() { return this.hasAttribute('open'); }
  });

  /* =========================================================================
   * <fb-info-table> — label／value 兩欄唯讀資訊表
   *   內含 <script type="application/json">[{ "label": "操作時間", "value": "…" }, …]</script>
   *   或以 rows setter 指定；label 欄固定寬、value 欄佔滿；相鄰列白／藍交錯背景
   *   value 為空字串時顯示「-」；長 value 自動換行撐高該列
   *   無排序／篩選／列互動
   * ====================================================================== */
  global.customElements.define('fb-info-table', class extends HTMLElement {
    connectedCallback() {
      if (!this._built) {
        this._built = true;
        this.classList.add('infotable');
        var seed = parseJSONAttr(this, 'rows', null);
        this._rows = Array.isArray(seed) ? seed : (this._rows || []);
      }
      this._render();
    }
    set rows(list) { this._rows = Array.isArray(list) ? list : []; if (this._built) this._render(); }
    get rows() { return this._rows || []; }
    _render() {
      this.textContent = '';
      (this._rows || []).forEach(function (r) {
        var row = el('div', 'infotable__row');
        var label = el('div', 'infotable__label');
        var val = el('div', 'infotable__val');
        label.textContent = (r && r.label != null) ? String(r.label) : '';
        var v = (r && r.value != null) ? String(r.value) : '';
        val.textContent = v === '' ? '-' : v;
        row.appendChild(label);
        row.appendChild(val);
        this.appendChild(row);
      }, this);
    }
  });

  /* =========================================================================
   * <fb-toggle checked variant="card" zh="啟用此角色" en="Active Status" desc="…">
   *   開關；variant="card" 時為含標題／副說明的卡片
   *   屬性：checked、disabled；事件：change { detail: { checked } }
   * ====================================================================== */
  global.customElements.define('fb-toggle', class extends HTMLElement {
    static get observedAttributes() { return ['checked', 'disabled']; }
    connectedCallback() { if (!this._built) { this._built = true; this._render(); this._bind(); } }
    attributeChangedCallback() { if (this._built) this._render(); }
    _render() {
      var card = this.getAttribute('variant') === 'card';
      var on = this.hasAttribute('checked');
      var dis = this.hasAttribute('disabled');
      this.classList.add('toggle');
      this.classList.toggle('toggle--card', card);
      this.classList.toggle('is-on', on);
      this.classList.toggle('is-disabled', dis);
      var sw = '<span class="toggle__switch" role="switch" aria-checked="' + on + '" tabindex="' +
        (dis ? -1 : 0) + '"><span class="toggle__knob"></span></span>';
      if (card) {
        this.innerHTML =
          '<span class="toggle__text">' +
            '<span class="toggle__title">' + (this.getAttribute('zh') || '') +
              ' <span class="toggle__title-en">' + (this.getAttribute('en') || '') + '</span></span>' +
            (this.getAttribute('desc') ? '<span class="toggle__desc">' + this.getAttribute('desc') + '</span>' : '') +
          '</span>' + sw;
      } else {
        this.innerHTML = sw;
      }
    }
    _bind() {
      this.addEventListener('click', (e) => {
        if (e.target.closest('input, a, button')) return;
        this._toggle();
      });
      this.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'Enter') && e.target.closest('.toggle__switch')) {
          e.preventDefault(); this._toggle();
        }
      });
    }
    _toggle() {
      if (this.hasAttribute('disabled')) return;
      this.checked = !this.hasAttribute('checked');
    }
    get checked() { return this.hasAttribute('checked'); }
    set checked(v) {
      var on = !!v;
      if (on === this.hasAttribute('checked')) { this._render(); return; }
      if (on) this.setAttribute('checked', ''); else this.removeAttribute('checked');
      this._render();
      this.dispatchEvent(new CustomEvent('change', { detail: { checked: on }, bubbles: true }));
    }
  });

  /* =========================================================================
   * <fb-icon-toggle on off-icon="fb-star-outline" on-icon="fb-star-filled">
   *   通用「單一圖示、兩態切換」按鈕；屬性：on、off-icon、on-icon、disabled
   *   事件：change { detail: { on } }；property：on（get/set）
   *   不內建任何網路請求／持久化，狀態是否保留由呼叫端決定
   * ====================================================================== */
  global.customElements.define('fb-icon-toggle', class extends HTMLElement {
    static get observedAttributes() { return ['on', 'off-icon', 'on-icon', 'disabled']; }
    connectedCallback() { if (!this._built) { this._built = true; this._render(); this._bind(); } }
    attributeChangedCallback() { if (this._built) this._render(); }
    _render() {
      var on = this.hasAttribute('on');
      var dis = this.hasAttribute('disabled');
      var iconName = on ? (this.getAttribute('on-icon') || '') : (this.getAttribute('off-icon') || '');
      this.classList.add('icon-toggle');
      this.classList.toggle('is-on', on);
      this.classList.toggle('is-disabled', dis);
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', dis ? '-1' : '0');
      this.setAttribute('aria-pressed', String(on));
      this.innerHTML = '<fb-icon name="' + iconName + '"></fb-icon>';
    }
    _bind() {
      this.addEventListener('click', () => { this._toggle(); });
      this.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this._toggle(); }
      });
    }
    _toggle() {
      if (this.hasAttribute('disabled')) return;
      this.on = !this.hasAttribute('on');
    }
    get on() { return this.hasAttribute('on'); }
    set on(v) {
      var val = !!v;
      if (val === this.hasAttribute('on')) { this._render(); return; }
      if (val) this.setAttribute('on', ''); else this.removeAttribute('on');
      this._render();
      this.dispatchEvent(new CustomEvent('change', { detail: { on: val }, bubbles: true }));
    }
  });

  /* =========================================================================
   * <fb-stat-card icon="fb-user" zh="系統總角色數" en="Total Roles" value="6" tone="primary|success">
   *   純展示統計卡（icon + 中英標題 + 大數字）；tone 控制 icon 顏色
   * ====================================================================== */
  global.customElements.define('fb-stat-card', class extends HTMLElement {
    static get observedAttributes() { return ['value']; }
    connectedCallback() { this.classList.add('stat-card'); this._render(); }
    attributeChangedCallback() { if (this.isConnected) this._render(); }
    _render() {
      var tone = this.getAttribute('tone');
      this.classList.toggle('stat-card--success', tone === 'success');
      this.classList.toggle('stat-card--warning', tone === 'warning');
      this.innerHTML =
        '<span class="stat-card__icon">' + ICON(this.getAttribute('icon') || 'fb-user') + '</span>' +
        '<span class="stat-card__text">' +
          '<span class="stat-card__zh">' + (this.getAttribute('zh') || '') + '</span>' +
          '<span class="stat-card__en">' + (this.getAttribute('en') || '') + '</span>' +
        '</span>' +
        '<span class="stat-card__value">' + (this.getAttribute('value') || '') + '</span>';
    }
    set value(v) { this.setAttribute('value', v); }
    get value() { return this.getAttribute('value'); }
  });

  /* =========================================================================
   * <fb-perm-tree> — 權限樹表（角色 Modal 內）
   *   內含 <script type="application/json">{ columns:[...], modules:[...] }</script>
   *   未提供時採內建 PERM_TREE_DATA（5 主模組 / 12 功能頁面）
   *   模組資料：{ key, zh, en, pages:[ { zh, caps:['read','edit','delete','export'] } ] }
   *              caps 缺項＝該欄不可勾
   *   方法：selectAll() / clearAll() / getSelection() / setSelection(sel)
   *   事件：perm-change { detail: { checked, total, exportChecked } }
   *          exportChecked = 已勾選的「匯出」欄數（匯出即特權；本資料 12 頁全部可匯出）
   *   對照 Figma dialog-新增角色 
   * ====================================================================== */
  var PERM_COLS = [
    { key: 'read', zh: '檢視', en: 'Read' },
    { key: 'edit', zh: '新增/編輯', en: 'Edit' },
    { key: 'delete', zh: '刪除', en: 'Delete' },
    { key: 'export', zh: '匯出', en: 'Export' }
  ];
  var ALL_CAPS = ['read', 'edit', 'delete', 'export'];
  var PERM_TREE_DATA = {
    columns: ALL_CAPS.slice(),
    modules: [
      { key: 'home', zh: '首頁', en: 'Home', pages: [
        { zh: '個人行事曆與行程管理', caps: ALL_CAPS },
        { zh: '即時交易庫存彙整', caps: ALL_CAPS }
      ]},
      { key: 'marketing', zh: '業務推廣', en: 'Marketing & Sales', pages: [
        { zh: '客戶訪談與服務紀錄', caps: ALL_CAPS },
        { zh: '活動管理法說會論壇', caps: ALL_CAPS },
        { zh: '顧問使用紀錄研究資源', caps: ALL_CAPS }
      ]},
      { key: 'customer', zh: '客戶綜合查詢', en: 'Customer Inquiry', pages: [
        { zh: '企業客戶綜合查詢', caps: ALL_CAPS },
        { zh: '單一客戶標籤與群組', caps: ALL_CAPS },
        { zh: '商品視角橫向透視', caps: ALL_CAPS }
      ]},
      { key: 'report', zh: '報表中心', en: 'Report Zone', pages: [
        { zh: '報表中心業績與佔比', caps: ALL_CAPS },
        { zh: '業務窗口收益統計與設定', caps: ALL_CAPS }
      ]},
      { key: 'tools', zh: '其他工具', en: 'Tools', pages: [
        { zh: '組織權限管轄與功能管理', caps: ALL_CAPS },
        { zh: '代理人設定與角色權限', caps: ALL_CAPS }
      ]}
    ]
  };

  global.customElements.define('fb-perm-tree', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'data', null);
      this._data = (cfg && cfg.modules) ? cfg : PERM_TREE_DATA;
      this._cols = (this._data.columns || ALL_CAPS).slice();
      // 勾選狀態：_sel[mi][pi] = { read:bool, ... }（僅含該頁 caps）
      this._sel = this._data.modules.map(function (m) {
        return m.pages.map(function () { return {}; });
      });
      this._collapsed = this._data.modules.map(function () { return false; });
      this._queryRaw = '';
      this._query = '';
      this._searchFocused = false;
      this.classList.add('perm-tree');
      this._render();
    }

    /* 搜尋比對：回傳 { moduleMatched, pageIdx }
     *   moduleMatched=true -> 模組名稱本身符合，pageIdx 為全部頁面索引
     *   moduleMatched=false 但 pageIdx 非空 -> 僅部分功能頁面名稱符合
     *   兩者皆否 -> 該模組整列不顯示 */
    _moduleMatches(mi) {
      var m = this._data.modules[mi];
      var all = m.pages.map(function (_, pi) { return pi; });
      if (!this._query) return { moduleMatched: true, pageIdx: all };
      if (m.zh.toLowerCase().indexOf(this._query) !== -1) return { moduleMatched: true, pageIdx: all };
      var idx = [];
      m.pages.forEach(function (p, pi) { if (p.zh.toLowerCase().indexOf(this._query) !== -1) idx.push(pi); }, this);
      return { moduleMatched: false, pageIdx: idx };
    }

    _pageCaps(mi, pi) {
      var c = this._data.modules[mi].pages[pi].caps || ALL_CAPS;
      var cols = this._cols;
      return c.filter(function (k) { return cols.indexOf(k) !== -1; });
    }
    _cell(mi, pi, cap) { return !!this._sel[mi][pi][cap]; }
    _setCell(mi, pi, cap, on) {
      if (this._pageCaps(mi, pi).indexOf(cap) === -1) return;
      this._sel[mi][pi][cap] = !!on;
    }

    _counts() {
      var total = 0, checked = 0, exportChecked = 0;
      var self = this;
      this._data.modules.forEach(function (m, mi) {
        m.pages.forEach(function (p, pi) {
          self._pageCaps(mi, pi).forEach(function (cap) {
            total++;
            if (self._cell(mi, pi, cap)) {
              checked++;
              if (cap === 'export') exportChecked++;
            }
          });
        });
      });
      return { total: total, checked: checked, exportChecked: exportChecked };
    }

    _emit() {
      var c = this._counts();
      this.dispatchEvent(new CustomEvent('perm-change', {
        detail: { checked: c.checked, total: c.total, exportChecked: c.exportChecked },
        bubbles: true
      }));
    }

    selectAll() { this._bulk(true); }
    clearAll() { this._bulk(false); }
    _bulk(on) {
      var self = this;
      this._data.modules.forEach(function (m, mi) {
        m.pages.forEach(function (p, pi) {
          self._pageCaps(mi, pi).forEach(function (cap) { self._setCell(mi, pi, cap, on); });
        });
      });
      this._render(); this._emit();
    }

    /* getSelection() -> { moduleKey: { pageZh: [caps...] } }（僅含有勾選者）*/
    getSelection() {
      var out = {}, self = this;
      this._data.modules.forEach(function (m, mi) {
        var pageMap = {};
        m.pages.forEach(function (p, pi) {
          var on = self._pageCaps(mi, pi).filter(function (cap) { return self._cell(mi, pi, cap); });
          if (on.length) pageMap[p.zh] = on;
        });
        if (Object.keys(pageMap).length) out[m.key] = pageMap;
      });
      return out;
    }

    /* setSelection(sel)：
     *   'all' -> 全選
     *   { moduleKey: 'all' | [pageZh...] | { pageZh: 'all' | [caps...] } }
     */
    setSelection(sel) {
      this._bulkSilent(false);
      var self = this;
      if (sel === 'all') { this._bulk(true); return; }
      sel = sel || {};
      this._data.modules.forEach(function (m, mi) {
        var ms = sel[m.key];
        if (ms == null) return;
        m.pages.forEach(function (p, pi) {
          var caps = self._pageCaps(mi, pi);
          var want = null;
          if (ms === 'all') want = caps;
          else if (Array.isArray(ms)) want = ms.indexOf(p.zh) !== -1 ? caps : [];
          else if (typeof ms === 'object') {
            var pv = ms[p.zh];
            if (pv == null) want = [];
            else if (pv === 'all') want = caps;
            else if (Array.isArray(pv)) want = pv;
          }
          if (want) caps.forEach(function (cap) { self._setCell(mi, pi, cap, want.indexOf(cap) !== -1); });
        });
      });
      this._grantReadForDependents();
      this._render(); this._emit();
    }
    _bulkSilent(on) {
      var self = this;
      this._data.modules.forEach(function (m, mi) {
        m.pages.forEach(function (p, pi) {
          self._pageCaps(mi, pi).forEach(function (cap) { self._setCell(mi, pi, cap, on); });
        });
      });
    }

    /* 三態：某模組某欄（或整模組）的勾選概況 -> 'all' | 'some' | 'none' */
    _moduleColState(mi, cap) {
      var self = this, tot = 0, on = 0;
      this._data.modules[mi].pages.forEach(function (p, pi) {
        if (self._pageCaps(mi, pi).indexOf(cap) === -1) return;
        tot++; if (self._cell(mi, pi, cap)) on++;
      });
      return tot === 0 ? 'none' : on === 0 ? 'none' : on === tot ? 'all' : 'some';
    }
    _moduleState(mi) {
      var self = this, tot = 0, on = 0;
      this._data.modules[mi].pages.forEach(function (p, pi) {
        self._pageCaps(mi, pi).forEach(function (cap) { tot++; if (self._cell(mi, pi, cap)) on++; });
      });
      return tot === 0 ? 'none' : on === 0 ? 'none' : on === tot ? 'all' : 'some';
    }
    _pageState(mi, pi) {
      var self = this, caps = this._pageCaps(mi, pi), on = 0;
      caps.forEach(function (cap) { if (self._cell(mi, pi, cap)) on++; });
      return caps.length === 0 ? 'none' : on === 0 ? 'none' : on === caps.length ? 'all' : 'some';
    }

    _chk(state, cls, dataAttrs) {
      var indet = state === 'some';
      var on = state === 'all';
      return '<span class="perm-chk ' + cls + (on ? ' is-on' : '') + (indet ? ' is-indeterminate' : '') +
        '" role="checkbox" tabindex="0" aria-checked="' + (indet ? 'mixed' : on) + '" ' + (dataAttrs || '') + '>' +
        '<span class="perm-chk__box"></span></span>';
    }

    _render() {
      var self = this;
      var head = '<div class="perm-tree__toolbar">' +
        '<label class="perm-tree__search">' + ICON('fb-search') +
          '<input type="text" placeholder="搜尋功能模組或關鍵字" value="' +
            (this._queryRaw || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"></label>' +
        '<span class="perm-tree__bulk-group">' +
        '<button type="button" class="perm-tree__bulk perm-tree__bulk--all" data-bulk="all">一鍵全選</button>' +
        '<button type="button" class="perm-tree__bulk perm-tree__bulk--clear" data-bulk="none">全部清空</button>' +
        '</span></div>';

      var rows = '';
      // header row
      rows += '<div class="perm-tree__row perm-tree__row--head">' +
        '<span class="perm-tree__fn"><span class="perm-tree__fn-zh">功能模組</span>' +
        '<span class="perm-tree__fn-en">Function</span></span>' +
        this._cols.map(function (k) {
          var c = PERM_COLS.filter(function (x) { return x.key === k; })[0] || { zh: k, en: k };
          return '<span class="perm-tree__col"><b>' + c.zh + '</b><i>' + c.en + '</i></span>';
        }).join('') + '</div>';

      this._data.modules.forEach(function (m, mi) {
        var match = self._moduleMatches(mi);
        if (!match.moduleMatched && match.pageIdx.length === 0) return; // 無符合：整個模組不顯示

        var collapsed = self._query ? false : self._collapsed[mi]; // 有查詢字串時強制展開，不寫入 _collapsed
        rows += '<div class="perm-tree__row perm-tree__row--module m-' + m.key +
          (mi % 2 ? ' is-alt' : '') + (collapsed ? ' is-collapsed' : '') + '">' +
          '<span class="perm-tree__fn">' +
            '<button type="button" class="perm-tree__caret" data-caret="' + mi + '" aria-label="展開收合">' +
              ICON('fb-chevron-down') + '</button>' +
            self._chk(self._moduleState(mi), 'perm-chk--module', 'data-m="' + mi + '"') +
            '<span class="perm-tree__mname">' + m.zh + '</span>' +
          '</span>' +
          self._cols.map(function (cap) {
            return '<span class="perm-tree__col">' +
              self._chk(self._moduleColState(mi, cap), 'perm-chk--modcol', 'data-m="' + mi + '" data-cap="' + cap + '"') +
              '</span>';
          }).join('') + '</div>';

        rows += '<div class="perm-tree__pages' + (collapsed ? ' is-collapsed' : '') + '" data-pages="' + mi + '">';
        match.pageIdx.forEach(function (pi) {
          var p = m.pages[pi];
          var caps = self._pageCaps(mi, pi);
          rows += '<div class="perm-tree__row perm-tree__row--page">' +
            '<span class="perm-tree__fn">' +
              self._chk(self._pageState(mi, pi), 'perm-chk--page', 'data-m="' + mi + '" data-p="' + pi + '"') +
              '<span class="perm-tree__pname">' + p.zh + '</span>' +
            '</span>' +
            self._cols.map(function (cap) {
              if (caps.indexOf(cap) === -1) return '<span class="perm-tree__col"><span class="perm-chk is-disabled"><span class="perm-chk__box"></span></span></span>';
              return '<span class="perm-tree__col">' +
                self._chk(self._cell(mi, pi, cap) ? 'all' : 'none', 'perm-chk--cell',
                  'data-m="' + mi + '" data-p="' + pi + '" data-cap="' + cap + '"') + '</span>';
            }).join('') + '</div>';
        });
        rows += '</div>';
      });

      this.innerHTML = head + '<div class="perm-tree__grid">' + rows + '</div>';

      var searchInput = this.querySelector('.perm-tree__search input');
      if (searchInput && this._searchFocused) {
        searchInput.focus();
        var len = searchInput.value.length;
        try { searchInput.setSelectionRange(len, len); } catch (e) {}
      }

      if (!this._bound) {
        this._bound = true;
        this.addEventListener('click', this._onClick.bind(this));
        this.addEventListener('keydown', (e) => {
          if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('perm-chk')) {
            e.preventDefault(); this._onToggle(e.target);
          }
        });
        this.addEventListener('input', (e) => {
          if (e.target.closest('.perm-tree__search')) {
            this._queryRaw = e.target.value;
            this._query = this._queryRaw.trim().toLowerCase();
            this._render();
          }
        });
        this.addEventListener('focusin', (e) => {
          if (e.target.closest('.perm-tree__search')) this._searchFocused = true;
        });
        this.addEventListener('focusout', (e) => {
          if (e.target.closest('.perm-tree__search')) this._searchFocused = false;
        });
      }
    }

    _onClick(e) {
      var bulk = e.target.closest('[data-bulk]');
      if (bulk) { bulk.getAttribute('data-bulk') === 'all' ? this.selectAll() : this.clearAll(); return; }
      var caret = e.target.closest('[data-caret]');
      if (caret) {
        var ci = +caret.getAttribute('data-caret');
        this._collapsed[ci] = !this._collapsed[ci];
        this._render();
        return;
      }
      var chk = e.target.closest('.perm-chk');
      if (chk && !chk.classList.contains('is-disabled')) this._onToggle(chk);
    }

    /* 相依規則：檢視(read) 為 新增·編輯/刪除/匯出 的前提
     *   勾任一後三項 -> 自動補勾 read；取消 read -> 自動取消後三項；read 可單獨勾選 */
    _applyReadDep(mi, pi, cap, on) {
      var caps = this._pageCaps(mi, pi), self = this;
      if (cap === 'read') {
        if (!on) ['edit', 'delete', 'export'].forEach(function (c) {
          if (caps.indexOf(c) !== -1) self._sel[mi][pi][c] = false;
        });
      } else if (on && caps.indexOf('read') !== -1) {
        this._sel[mi][pi].read = true;
      }
    }
    /* 載入既有選取時：凡有後三項之一被勾，補上 read（不移除任何項）*/
    _grantReadForDependents() {
      var self = this;
      this._data.modules.forEach(function (m, mi) {
        m.pages.forEach(function (p, pi) {
          var caps = self._pageCaps(mi, pi);
          if (caps.indexOf('read') === -1) return;
          var hasDep = ['edit', 'delete', 'export'].some(function (c) {
            return caps.indexOf(c) !== -1 && self._cell(mi, pi, c);
          });
          if (hasDep) self._sel[mi][pi].read = true;
        });
      });
    }

    _onToggle(chk) {
      var mi = chk.getAttribute('data-m'); if (mi == null) return;
      mi = +mi;
      var cap = chk.getAttribute('data-cap');
      var pi = chk.getAttribute('data-p');
      var self = this;
      if (pi != null && cap != null) {
        pi = +pi;
        var nv = !this._cell(mi, pi, cap);
        this._setCell(mi, pi, cap, nv);
        this._applyReadDep(mi, pi, cap, nv);
      } else if (pi != null) {
        pi = +pi;
        var turnOn = this._pageState(mi, pi) !== 'all';
        this._pageCaps(mi, pi).forEach(function (c) { self._setCell(mi, pi, c, turnOn); });
      } else if (cap != null) {
        var onCol = this._moduleColState(mi, cap) !== 'all';
        this._data.modules[mi].pages.forEach(function (p, ppi) {
          self._setCell(mi, ppi, cap, onCol);
          self._applyReadDep(mi, ppi, cap, onCol);
        });
      } else {
        var onMod = this._moduleState(mi) !== 'all';
        this._data.modules[mi].pages.forEach(function (p, ppi) {
          self._pageCaps(mi, ppi).forEach(function (c) { self._setCell(mi, ppi, c, onMod); });
        });
      }
      this._render();
      this._emit();
    }
  });

  /* =========================================================================
   * <fb-export-dialog> — 自訂匯出報表對話框（可復用、與報表資料無關）
   * 方法：open(config?) / close()
   *   config: {
   *     time: 'monthly' | 'weekly'                       // 預設 'monthly'
   *     metrics: string[] ⊂ ['mtd','ytd','mom','yoy','monthlyize']  // 預設全選
   *     detailLevel: 'affiliate' | 'category' | 'foreignCategory' | 'household' | 'account'  // 預設 'affiliate'
   *     summary: string[] ⊂ ['subtotal','total']        // 預設兩者皆選
   *     marketShareMode: boolean   // true -> 停用「月化」+ tooltip
   *     partialMonthMode: boolean  // true -> 頂部警告 + 「報表時間維度」「統計比較指標」兩區停用且皆不預設選取；
   *                                //         客戶明細層級與彙總計算維持與 1 號情境相同
   *     foreignMode: boolean       // true -> 境外版差異：客戶明細層級新增「境外分類彙總」、最後一層改為
   *                                //         「子帳號明細」、佔比 tooltip 文案不同、多一個「專案交易匯出」開關區塊
   *                                //         （僅 pages/foreign_basic_report.html 使用）
   *   }
   *   連動：客戶明細層級為 'account' 時彙總計算兩項強制取消勾選且停用，export payload 的 summary 為 []
   * 事件：export { detail: { time, metrics, detailLevel, summary, dmaExport? } }（dmaExport 僅 foreignMode 時提供） / cancel
   * （境內：Default / 佔比指標 / 非1號開始 / 客戶帳號明細(無彙總計算) / 非1號開始+客戶帳號明細 / Loading）
   * 境外版（dialog-自訂匯出報表-境外：Default / 展開至子帳號 / Loading / 非1號開始 / 非1號開始+展開至子帳號 / 佔比指標）
   * ====================================================================== */
  var EXP_METRICS = [
    { key: 'mtd', title: '月累計' },
    { key: 'ytd', title: '年累計' },
    { key: 'mom', title: '月增率' },
    { key: 'yoy', title: '年增率' },
    { key: 'monthlyize', title: '月化' }
  ];
  var EXP_TIME = [
    { key: 'monthly', title: '僅匯出「月份累計」資料', desc: '報表橫向僅平舖各個歷史月份的整月統計，不展開週欄位。' },
    { key: 'weekly', title: '展開「週明細」資料', desc: '報表將逐月展開 第1週至第5週的每週數據，欄位量較多。' }
  ];
  var EXP_LEVEL_FOREIGN_ITEM = { key: 'foreignCategory', title: '境外分類彙總', desc: '呈現至「境外分類」彙總列。' };
  /* foreignMode 時在「產業類別彙總」與「客戶群彙總」之間插入「境外分類彙總」；最後一層（account）標題/說明
     境內為「客戶帳號明細／展開至客戶名稱、主帳號、業務員。」，境外為「子帳號明細／展開至客戶名稱、主帳號、子帳號、業務員。」
     （ 內「客戶明細層級」五個選項） */
  function expLevelsFor(foreignMode) {
    var levels = [
      { key: 'affiliate', title: '集團戶彙總', desc: '僅呈現至「集團戶/一般客戶」彙總列。' },
      { key: 'category', title: '產業類別彙總', desc: '僅呈現至「產業類別（如科技業、製造業、零售業）」彙總列。' }
    ];
    if (foreignMode) levels.push(EXP_LEVEL_FOREIGN_ITEM);
    levels.push({ key: 'household', title: '客戶群彙總', desc: '呈現至「客戶群（如北辰科技、安泰製造）」彙總列，不展開下方帳號明細。' });
    levels.push(foreignMode
      ? { key: 'account', title: '子帳號明細', desc: '展開至客戶名稱、主帳號、子帳號、業務窗口。' }
      : { key: 'account', title: '客戶帳號明細', desc: '展開至客戶名稱、主帳號、業務窗口。' });
    return levels;
  }
  var EXP_SUMMARY = [
    { key: 'subtotal', title: '包含小計', desc: '依據所選的客戶明細層級，自動計算所有父階層的小計列。' },
    { key: 'total', title: '包含總計', desc: '自動計算整份報表的全域總計列。' }
  ];
  var EXP_LEVEL_KEYS = expLevelsFor(true).map(function (it) { return it.key; });
  /* 佔比 tooltip 文案境內／境外不同（各自對照 Figma 原文） */
  function expMarketShareTip(foreignMode) {
    return foreignMode ? '佔比全月推算無實質業務意義' : '佔比全月結算無實質業務意義';
  }
  var EXP_PARTIAL_WARN = '當前選取的日期區間起始日非 1 號，系統已自動啟用「非整月簡化模式」。匯出檔案將不區分月份與週，亦不提供月累計／年累計比較指標，右側僅會呈現單一「選取區間累計數據」欄位。';
  /* 境外專屬「專案交易匯出」開關：預設開啟， form 區塊 */
  var EXP_DMA_ZH = '專案交易匯出';
  var EXP_DMA_EN = 'Project Trade Export';
  var EXP_DMA_DESC = '包含並獨立呈現專案交易數據列，總計列下方，保留一列獨立的專案交易彙總數據。';
  /* 境外選「子帳號明細」時的隱碼提醒（「展開至子帳號」狀態） */
  var EXP_SUBACCOUNT_WARN = '子帳號展開後資料筆數極多。系統將自動對客戶主帳號進行隱碼遮蔽（如 969***45），子帳號則完整呈現。';

  function expDefaultState() {
    return {
      time: 'monthly',
      metrics: EXP_METRICS.map(function (m) { return m.key; }),
      detailLevel: 'affiliate',
      summary: EXP_SUMMARY.map(function (s) { return s.key; }),
      marketShareMode: false,
      partialMonthMode: false,
      foreignMode: false,
      dmaExport: true
    };
  }

  /* 依條件旗標把 state 正規化（佔比／簡化模式的強制效果），open() 與 Reset 共用 */
  function expNormalizeForFlags(st) {
    if (st.marketShareMode) {
      st.metrics = st.metrics.filter(function (k) { return k !== 'monthlyize'; });
    }
    if (st.partialMonthMode) {
      /* 簡化模式：僅「報表時間維度」與「統計比較指標」兩區停用且不預設選取；
         客戶明細層級與彙總計算維持與 1 號情境相同 */
      st.time = null;
      st.metrics = [];
    }
    /* 非境外頁不提供「境外分類彙總」，若殘留該選取值則退回「產業類別彙總」 */
    if (!st.foreignMode && st.detailLevel === 'foreignCategory') {
      st.detailLevel = 'category';
    }
    /* 彙總計算 × 客戶明細層級連動：選「客戶帳號明細／子帳號明細」時彙總計算不可用且清空；
       境外版另強制關閉並停用「專案交易匯出」（「展開至子帳號」狀態） */
    if (st.detailLevel === 'account') {
      st.summary = [];
      st.dmaExport = false;
    }
    return st;
  }

  global.customElements.define('fb-export-dialog', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._state = expDefaultState();
      this._onKey = (e) => { if (e.key === 'Escape' && this.hasAttribute('open')) this._cancel(); };
      this.classList.add('expdlg');
      this._render();

      this.addEventListener('click', (e) => {
        if (this.hasAttribute('busy')) return;
        if (e.target.closest('[data-close]') || e.target.closest('[data-cancel]')) { this._cancel(); return; }
        if (e.target.closest('[data-reset]')) { this._state = this._withFlags(expDefaultState()); this._paint(); return; }
        if (e.target.closest('[data-export]')) { this._doExport(); return; }
        var card = e.target.closest('.select-card');
        if (card && !card.classList.contains('is-disabled')) this._onCard(card);
      });
      this.addEventListener('keydown', (e) => {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        var card = e.target.closest('.select-card');
        if (!card || card.classList.contains('is-disabled')) return;
        e.preventDefault();
        this._onCard(card);
      });
      /* 停用卡片的提示文字沿用全域 fb-tooltip（data-tip 委派），不另建浮層 */
      this.addEventListener('change', (e) => {
        if (e.target.closest('[data-role="dma-toggle"]')) this._state.dmaExport = !!e.detail.checked;
      });
    }

    /* 保留來自 open(config) 的條件旗標，套用在新的預設 state 上 */
    _withFlags(st) {
      st.marketShareMode = this._state.marketShareMode;
      st.partialMonthMode = this._state.partialMonthMode;
      st.foreignMode = this._state.foreignMode;
      return expNormalizeForFlags(st);
    }

    open(config) {
      var st = expDefaultState();
      config = config || {};
      if (config.time === 'weekly' || config.time === 'monthly') st.time = config.time;
      if (Array.isArray(config.metrics)) st.metrics = config.metrics.slice();
      if (EXP_LEVEL_KEYS.indexOf(config.detailLevel) !== -1) st.detailLevel = config.detailLevel;
      if (Array.isArray(config.summary)) {
        st.summary = config.summary.filter(function (k) { return k === 'subtotal' || k === 'total'; });
      }
      st.marketShareMode = !!config.marketShareMode;
      st.partialMonthMode = !!config.partialMonthMode;
      st.foreignMode = !!config.foreignMode;
      expNormalizeForFlags(st);
      this._state = st;
      this.removeAttribute('busy');
      if (!this.hasAttribute('open')) lockScroll();
      this.setAttribute('open', '');
      doc.addEventListener('keydown', this._onKey);
      this._paint();
      var body = this.querySelector('.expdlg__body');
      if (body) body.scrollTop = 0;
    }
    close() {
      if (global.FbTooltip) global.FbTooltip.hide();
      if (this.hasAttribute('open')) unlockScroll();
      this.removeAttribute('open');
      this.removeAttribute('busy');
      doc.removeEventListener('keydown', this._onKey);
    }
    disconnectedCallback() {
      if (this.hasAttribute('open')) unlockScroll();
    }
    _cancel() {
      this.close();
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
    }
    _doExport() {
      if (this.hasAttribute('busy')) return;
      this.setAttribute('busy', '');
      var self = this;
      this._busyT = setTimeout(function () {
        var detail = {
          time: self._state.time,
          metrics: self._state.metrics.slice(),
          detailLevel: self._state.detailLevel,
          summary: self._state.summary.slice()
        };
        if (self._state.foreignMode) detail.dmaExport = self._state.dmaExport;
        self.dispatchEvent(new CustomEvent('export', { detail: detail, bubbles: true }));
        self.close();
      }, 800);
    }

    _onCard(card) {
      var group = card.getAttribute('data-group');
      var val = card.getAttribute('data-value');
      if (group === 'time') this._state.time = val;
      else if (group === 'level') {
        var prevLevel = this._state.detailLevel;
        this._state.detailLevel = val;
        /* 切到「客戶帳號明細／子帳號明細」清空彙總計算並強制關閉 專案交易匯出；
           由該層級切回其他層級還原為預設全選／專案交易匯出重新開啟 */
        if (val === 'account') { this._state.summary = []; this._state.dmaExport = false; }
        else if (prevLevel === 'account') {
          this._state.summary = EXP_SUMMARY.map(function (s) { return s.key; });
          this._state.dmaExport = true;
        }
      }
      else if (group === 'metric') {
        var i = this._state.metrics.indexOf(val);
        if (i === -1) this._state.metrics.push(val);
        else this._state.metrics.splice(i, 1);
      }
      else if (group === 'summary') {
        var j = this._state.summary.indexOf(val);
        if (j === -1) this._state.summary.push(val);
        else this._state.summary.splice(j, 1);
      }
      this._paint();
    }

    _render() {
      this.innerHTML =
        '<div class="expdlg__mask"></div>' +
        '<div class="expdlg__panel" role="dialog" aria-modal="true" aria-label="自訂匯出報表">' +
          '<div class="expdlg__hd">' +
            '<h3 class="expdlg__title">自訂匯出報表</h3>' +
            '<span class="expdlg__subtitle">Export Report</span>' +
            '<p class="expdlg__note">為符合資安規範，匯出之檔案將採取強制密碼加密。檔案開啟密碼預設為您的「登入帳號」，請妥善保管下載檔案。</p>' +
            '<button type="button" class="expdlg__close" data-close aria-label="關閉">' + ICON('fb-close') + '</button>' +
          '</div>' +
          '<div class="expdlg__body">' +
            '<div class="expdlg__warn" data-warn hidden>' + ICON('fb-alert-triangle') + '<span data-warn-text></span></div>' +
            '<div class="expdlg__section" data-section="time">' +
              '<p class="expdlg__section-title">報表時間維度</p>' +
              '<div data-cards="time"></div>' +
            '</div>' +
            '<div class="expdlg__section" data-section="metric">' +
              '<p class="expdlg__section-title">統計比較指標</p>' +
              '<div class="select-card-grid" data-cards="metric"></div>' +
            '</div>' +
            '<div class="expdlg__section" data-section="level">' +
              '<p class="expdlg__section-title">客戶明細層級</p>' +
              '<div data-cards="level"></div>' +
              '<div class="expdlg__warn" data-warn-sub hidden>' + ICON('fb-alert-triangle') + '<span>' + EXP_SUBACCOUNT_WARN + '</span></div>' +
            '</div>' +
            '<div class="expdlg__section" data-section="summary">' +
              '<p class="expdlg__section-title">彙總計算</p>' +
              '<div data-cards="summary"></div>' +
            '</div>' +
            '<div class="expdlg__section" data-section="dma" hidden>' +
              '<fb-toggle variant="card" data-role="dma-toggle" zh="' + EXP_DMA_ZH + '" en="' + EXP_DMA_EN + '" desc="' + EXP_DMA_DESC + '"></fb-toggle>' +
            '</div>' +
          '</div>' +
          '<div class="expdlg__ft">' +
            '<button type="button" class="expdlg__reset" data-reset>重置預設值 <span class="en">Reset</span></button>' +
            '<div class="expdlg__ft-right">' +
              '<button type="button" class="btn-neutral-outline" data-cancel>取消 <span class="en">Cancel</span></button>' +
              '<button type="button" class="btn-primary" data-export>匯出 <span class="en">Export</span></button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    _cardHtml(variant, group, item, selected, disabled, tip) {
      return '<div class="select-card select-card--' + variant +
        (selected ? ' is-selected' : '') + (disabled ? ' is-disabled' : '') + '"' +
        ' data-group="' + group + '" data-value="' + item.key + '"' +
        (tip ? ' data-tip="' + tip.replace(/"/g, '&quot;') + '"' : '') +
        ' role="' + (variant === 'radio' ? 'radio' : 'checkbox') + '" aria-checked="' + (selected ? 'true' : 'false') + '"' +
        (disabled ? ' aria-disabled="true"' : ' tabindex="0"') + '>' +
        '<span class="select-card__marker"></span>' +
        '<span class="select-card__body">' +
          '<span class="select-card__title">' + (item.title || item.label || '') + '</span>' +
          (item.desc ? '<span class="select-card__desc">' + item.desc + '</span>' : '') +
        '</span>' +
      '</div>';
    }

    _paint() {
      var st = this._state;

      var warn = this.querySelector('[data-warn]');
      warn.hidden = !st.partialMonthMode;
      this.querySelector('[data-warn-text]').textContent = EXP_PARTIAL_WARN;

      var self = this;
      this.querySelector('[data-cards="time"]').innerHTML = EXP_TIME.map(function (it) {
        return self._cardHtml('radio', 'time', it, st.time === it.key, st.partialMonthMode);
      }).join('');
      this.querySelector('[data-cards="metric"]').innerHTML = EXP_METRICS.map(function (it) {
        var isMonthlyize = it.key === 'monthlyize';
        var disabled = st.partialMonthMode || (isMonthlyize && st.marketShareMode);
        var tip = (isMonthlyize && st.marketShareMode) ? expMarketShareTip(st.foreignMode) : '';
        return self._cardHtml('checkbox', 'metric', it, st.metrics.indexOf(it.key) !== -1, disabled, tip);
      }).join('');
      this.querySelector('[data-cards="level"]').innerHTML = expLevelsFor(st.foreignMode).map(function (it) {
        return self._cardHtml('radio', 'level', it, st.detailLevel === it.key, false);
      }).join('');
      this.querySelector('[data-cards="summary"]').innerHTML = EXP_SUMMARY.map(function (it) {
        var disabled = st.detailLevel === 'account';
        return self._cardHtml('checkbox', 'summary', it, st.summary.indexOf(it.key) !== -1, disabled, '');
      }).join('');

      this.querySelector('[data-section="time"]').classList.toggle('is-disabled', st.partialMonthMode);
      this.querySelector('[data-section="metric"]').classList.toggle('is-disabled', st.partialMonthMode);

      var warnSub = this.querySelector('[data-warn-sub]');
      warnSub.hidden = !(st.foreignMode && st.detailLevel === 'account');

      var dmaSection = this.querySelector('[data-section="dma"]');
      dmaSection.hidden = !st.foreignMode;
      var dmaToggle = dmaSection.querySelector('[data-role="dma-toggle"]');
      if (dmaToggle) {
        dmaToggle.checked = st.dmaExport;
        dmaToggle.toggleAttribute('disabled', st.detailLevel === 'account');
      }
    }
  });

  /* =========================================================================
   * <fb-batch-export-dialog> — 批次匯出對話框（可復用）
   * 方法：open({ count, limit }) / close()
   *   count — 查詢結果筆數；limit — 單次下載上限（預設 2000）
   *   batches = ceil(count / limit)；count > limit 時顯示分批提示
   * 事件：export { detail: { count, limit, batches } } / cancel
   *   × / Esc / 取消 皆等同取消並關閉；點遮罩不關閉；開啟時鎖定底層捲動
   * （Dialog-匯出，含「超過單次下載上限」變體）
   * ====================================================================== */
  global.customElements.define('fb-batch-export-dialog', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._count = 0;
      this._limit = 2000;
      this._onKey = (e) => { if (e.key === 'Escape' && this.hasAttribute('open')) this._cancel(); };
      this.classList.add('bxdlg');
      this.innerHTML =
        '<div class="bxdlg__mask"></div>' +
        '<div class="bxdlg__panel" role="dialog" aria-modal="true" aria-label="匯出">' +
          '<div class="bxdlg__hd">' +
            '<div class="bxdlg__title-wrap"><h3 class="bxdlg__title">匯出</h3>' +
            '<span class="bxdlg__subtitle">Export</span></div>' +
            '<button type="button" class="bxdlg__close" data-close aria-label="關閉">' + ICON('fb-close') + '</button>' +
          '</div>' +
          '<div class="bxdlg__body">' +
            '<div class="bxdlg__info">' +
              '<p class="bxdlg__count">查詢結果 共 <b data-count>0</b> 筆</p>' +
              '<p class="bxdlg__batch" data-batch hidden>超過單次下載上限（<b data-limit>0</b> 筆），系統將自動分批下載 共 <b data-batches>0</b> 批</p>' +
            '</div>' +
            '<p class="bxdlg__note"><fb-icon name="fb-info"></fb-icon> <span data-note></span></p>' +
          '</div>' +
          '<div class="bxdlg__ft">' +
            '<button type="button" class="btn-neutral-outline" data-cancel>取消</button>' +
            '<button type="button" class="btn-primary" data-export>下載</button>' +
          '</div>' +
        '</div>';
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]') || e.target.closest('[data-cancel]')) { this._cancel(); return; }
        if (e.target.closest('[data-export]')) { this._doExport(); return; }
      });
    }
    open(cfg) {
      cfg = cfg || {};
      this._count = Math.max(0, Number(cfg.count) || 0);
      this._limit = cfg.limit != null && Number(cfg.limit) > 0 ? Number(cfg.limit) : 2000;
      this._batches = Math.ceil(this._count / this._limit) || 1;
      var over = this._count > this._limit;
      var fmt = function (n) { return n.toLocaleString('en-US'); };
      this.querySelector('[data-count]').textContent = fmt(this._count);
      this.querySelector('[data-limit]').textContent = fmt(this._limit);
      this.querySelector('[data-batches]').textContent = this._batches;
      this.querySelector('[data-batch]').hidden = !over;
      this.querySelector('[data-note]').textContent = over
        ? '每批約 ' + fmt(this._limit) + ' 筆，檔案格式：CSV'
        : '檔案格式：CSV';
      this.querySelector('[data-export]').textContent = over ? '分批下載' : '下載';
      if (!this.hasAttribute('open')) lockScroll();
      this.setAttribute('open', '');
      doc.addEventListener('keydown', this._onKey);
    }
    close() {
      if (this.hasAttribute('open')) unlockScroll();
      this.removeAttribute('open');
      doc.removeEventListener('keydown', this._onKey);
    }
    disconnectedCallback() { if (this.hasAttribute('open')) unlockScroll(); }
    _cancel() {
      this.close();
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
    }
    _doExport() {
      this.dispatchEvent(new CustomEvent('export', {
        detail: { count: this._count, limit: this._limit, batches: this._batches },
        bubbles: true
      }));
      this.close();
    }
  });

  /* =========================================================================
   * <fb-transfer> — 雙欄穿梭清單 Dual Listbox
   *   內含 <script type="application/json">{ items:[{id,label}], value:["id"...],
   *        leftTitle:"未管轄組織", rightTitle:"管轄組織" }</script>
   *   或以 left-title / right-title 屬性覆寫標題
   *   結構（對照 Figma Dual Listbox ）：
   *     每欄＝標題（框外）＋方框（灰底搜尋列 + 白底可捲清單）；
   *     兩欄之間為 4 顆方形 icon 按鈕：›（選取右移）»（全部右移）‹（選取左移）«（全部左移）
   *   清單為多選：點列切換選取，再用中間按鈕整批搬移
   *   方法：get/set value（右欄 id 陣列）、setData(items, value)
   *   事件：transfer-change { detail: { value: string[] } }
   * ====================================================================== */
  global.customElements.define('fb-transfer', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'data', {}) || {};
      this._leftTitle = this.getAttribute('left-title') || cfg.leftTitle || '未管轄組織';
      this._rightTitle = this.getAttribute('right-title') || cfg.rightTitle || '管轄組織';
      this._items = (cfg.items || []).map(function (it) {
        return { id: String(it.id), label: it.label != null ? String(it.label) : String(it.id) };
      });
      this._right = {};
      (cfg.value || []).forEach(function (id) { this._right[String(id)] = true; }, this);
      this._q = { left: '', right: '' };
      this._sel = { left: {}, right: {} };   // 目前選取（待搬移）
      this.classList.add('transfer');
      this._render();
      this._bind();
    }

    /* 某欄目前所有項目（不套用搜尋）*/
    _sideItems(side) {
      var self = this;
      return this._items.filter(function (it) {
        var onRight = !!self._right[it.id];
        return side === 'right' ? onRight : !onRight;
      });
    }
    /* 某欄搜尋後可見項目 */
    _visible(side) {
      var q = this._q[side].trim().toLowerCase();
      return this._sideItems(side).filter(function (it) {
        return !q || it.label.toLowerCase().indexOf(q) !== -1;
      });
    }

    _colHtml(side) {
      var self = this;
      var title = side === 'left' ? this._leftTitle : this._rightTitle;
      var rows = this._visible(side).map(function (it) {
        var on = !!self._sel[side][it.id];
        return '<li class="transfer__item' + (on ? ' is-selected' : '') + '" data-id="' + it.id +
          '" data-side="' + side + '" role="option" aria-selected="' + on + '" tabindex="0">' + it.label + '</li>';
      }).join('');
      return '<div class="transfer__col" data-col="' + side + '">' +
        '<div class="transfer__title">' + title + '</div>' +
        '<div class="transfer__box">' +
          '<div class="transfer__search">' +
            '<span class="transfer__search-field">' +
              '<input type="text" data-search="' + side + '" placeholder="搜尋" value="' +
                this._q[side].replace(/"/g, '&quot;') + '">' +
              ICON('fb-search') +
            '</span>' +
          '</div>' +
          '<ul class="transfer__list" role="listbox" aria-multiselectable="true">' +
            (rows || '<li class="transfer__empty">無項目</li>') + '</ul>' +
        '</div>' +
      '</div>';
    }

    _ctrlHtml() {
      var chev = ICON('fb-chevron-left');
      var mk = function (act, cls, dir, count, label) {
        var ics = count === 2 ? chev + chev : chev;
        return '<button type="button" class="transfer__move transfer__move--' + cls +
          '" data-act="' + act + '" aria-label="' + label + '">' +
          '<span class="transfer__move-ic transfer__move-ic--' + dir + '">' + ics + '</span></button>';
      };
      return '<div class="transfer__ctrl">' +
        mk('right', 'single', 'right', 1, '將選取項目移至管轄組織') +
        mk('right-all', 'all', 'right', 2, '將全部移至管轄組織') +
        mk('left', 'single', 'left', 1, '將選取項目移回未管轄組織') +
        mk('left-all', 'all', 'left', 2, '將全部移回未管轄組織') +
      '</div>';
    }

    _render() {
      var active = doc.activeElement;
      var focusSide = active && active.matches && active.matches('[data-search]')
        ? active.getAttribute('data-search') : null;
      this.innerHTML = this._colHtml('left') + this._ctrlHtml() + this._colHtml('right');
      this._syncCtrl();
      if (focusSide) {
        var restore = this.querySelector('[data-search="' + focusSide + '"]');
        if (restore) { restore.focus(); restore.setSelectionRange(restore.value.length, restore.value.length); }
      }
    }

    _syncCtrl() {
      var selCount = function (o) { return Object.keys(o).length; };
      var set = (act, on) => {
        var b = this.querySelector('[data-act="' + act + '"]');
        if (b) b.disabled = !on;
      };
      set('right', selCount(this._sel.left) > 0);
      set('left', selCount(this._sel.right) > 0);
      set('right-all', this._visible('left').length > 0);
      set('left-all', this._visible('right').length > 0);
    }

    _bind() {
      this.addEventListener('input', (e) => {
        var s = e.target.getAttribute && e.target.getAttribute('data-search');
        if (!s) return;
        this._q[s] = e.target.value;
        this._render();
      });
      this.addEventListener('click', (e) => {
        var btn = e.target.closest('[data-act]');
        if (btn) { if (!btn.disabled) this._doAct(btn.getAttribute('data-act')); return; }
        var item = e.target.closest('.transfer__item');
        if (item) this._toggleSel(item.getAttribute('data-side'), item.getAttribute('data-id'));
      });
      this.addEventListener('keydown', (e) => {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        var item = e.target.closest('.transfer__item');
        if (!item) return;
        e.preventDefault();
        this._toggleSel(item.getAttribute('data-side'), item.getAttribute('data-id'));
      });
    }

    _toggleSel(side, id) {
      if (this._sel[side][id]) delete this._sel[side][id];
      else this._sel[side][id] = true;
      this._render();
    }

    /* act: right | right-all | left | left-all */
    _doAct(act) {
      var toRight = act === 'right' || act === 'right-all';
      var all = act === 'right-all' || act === 'left-all';
      var fromSide = toRight ? 'left' : 'right';
      var ids = all
        ? this._visible(fromSide).map(function (it) { return it.id; })
        : Object.keys(this._sel[fromSide]);
      if (!ids.length) return;
      ids.forEach((id) => {
        if (toRight) this._right[id] = true;
        else delete this._right[id];
      });
      this._sel = { left: {}, right: {} };
      this._render();
      this._emit();
    }

    _emit() {
      this.dispatchEvent(new CustomEvent('transfer-change', {
        detail: { value: this.value }, bubbles: true
      }));
    }

    get value() {
      var self = this;
      return this._items.filter(function (it) { return self._right[it.id]; })
        .map(function (it) { return it.id; });
    }
    set value(v) {
      this._right = {};
      (v || []).forEach(function (id) { this._right[String(id)] = true; }, this);
      this._sel = { left: {}, right: {} };
      if (this._built) this._render();
    }

    setData(items, value) {
      this._items = (items || []).map(function (it) {
        return { id: String(it.id), label: it.label != null ? String(it.label) : String(it.id) };
      });
      this._right = {};
      (value || []).forEach(function (id) { this._right[String(id)] = true; }, this);
      this._q = { left: '', right: '' };
      this._sel = { left: {}, right: {} };
      if (this._built) this._render();
    }
  });

  /* =========================================================================
   * <fb-pagination total="1000" page="1" page-size="20">
   *   內含 <script type="application/json">{ "total": 1000, "page": 1, "pageSize": 20, "sizes": [20,50,100] }</script>
   *   或 total / page / page-size 屬性、sizes 屬性（逗號分隔）
   * 三段：資訊列（顯示第 X 到 Y 筆，共 T 筆資料）＋ 頁碼區（前後箭頭＋頁碼＋省略號）＋ 每頁筆數下拉
   * 事件：page-change { detail: { page, pageSize } }
   * 方法：setTotal(total, page?) — 重繪但不派事件；getter page / pageSize
   * 對照 Figma 代理人設定清單頁  底部分頁列
   * ====================================================================== */
  global.customElements.define('fb-pagination', class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cfg = parseJSONAttr(this, 'config', {}) || {};
      var sizesAttr = this.getAttribute('sizes');
      this._sizes = sizesAttr
        ? sizesAttr.split(',').map(function (s) { return parseInt(s.trim(), 10); }).filter(Boolean)
        : (Array.isArray(cfg.sizes) && cfg.sizes.length ? cfg.sizes.map(Number) : [20, 50, 100]);
      this._total = num(this.getAttribute('total'), cfg.total, 0);
      this._pageSize = num(this.getAttribute('page-size'), cfg.pageSize, this._sizes[0]);
      if (this._sizes.indexOf(this._pageSize) === -1) this._sizes.unshift(this._pageSize);
      this._page = num(this.getAttribute('page'), cfg.page, 1);
      this.classList.add('pager');
      this._clampPage();
      this._render();
      this.addEventListener('click', (e) => {
        var b = e.target.closest('button[data-pg]');
        if (!b || b.disabled) return;
        var v = b.getAttribute('data-pg');
        var next = v === 'prev' ? this._page - 1 : v === 'next' ? this._page + 1 : parseInt(v, 10);
        if (next === this._page) return;
        this._page = next;
        this._clampPage();
        this._render();
        this._emit();
      });
      this.addEventListener('change', (e) => {
        if (!e.target.matches('select[data-size]')) return;
        this._pageSize = parseInt(e.target.value, 10);
        this._page = 1;
        this._render();
        this._emit();
      });
    }

    get pageCount() { return Math.max(1, Math.ceil(this._total / this._pageSize)); }
    get page() { return this._page; }
    get pageSize() { return this._pageSize; }

    _clampPage() {
      if (this._page < 1) this._page = 1;
      if (this._page > this.pageCount) this._page = this.pageCount;
    }

    setTotal(total, page) {
      this._total = Math.max(0, Number(total) || 0);
      if (page != null) this._page = parseInt(page, 10) || 1;
      this._clampPage();
      if (this._built) this._render();
    }

    _emit() {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: { page: this._page, pageSize: this._pageSize }, bubbles: true
      }));
    }

    /* 產生頁碼序列（含 '…' 佔位）：總元件數固定為 7（`last <= 7` 時全部列出，數量隨總頁數）。
       第 1、末頁恆為數字；中段隨目前頁移動並以 '…' 補位：
         近頭 → 1 2 3 4 5 … last ／ 中間 → 1 … p-1 p p+1 … last ／ 近尾 → 1 … last-4 last-3 last-2 last-1 last */
    _pageList() {
      var last = this.pageCount;
      var cur = this._page;
      if (last <= 7) {
        var all = [];
        for (var p = 1; p <= last; p++) all.push(p);
        return all;
      }
      var left = Math.max(2, cur - 1);
      var right = Math.min(last - 1, cur + 1);
      var showL = left > 2;
      var showR = right < last - 1;
      var mid;
      if (!showL && showR) mid = [2, 3, 4, 5];
      else if (showL && !showR) mid = [last - 4, last - 3, last - 2, last - 1];
      else mid = [cur - 1, cur, cur + 1];
      var out = [1];
      if (showL) out.push('…');
      mid.forEach(function (n) { out.push(n); });
      if (showR) out.push('…');
      out.push(last);
      return out;
    }

    _render() {
      var last = this.pageCount;
      var from = this._total === 0 ? 0 : (this._page - 1) * this._pageSize + 1;
      var to = Math.min(this._page * this._pageSize, this._total);

      var btns = '<button type="button" class="pager__btn" data-pg="prev" aria-label="上一頁"' +
        (this._page <= 1 ? ' disabled' : '') + '>' + ICON('fb-chevron-left') + '</button>';
      btns += this._pageList().map((n) => {
        if (n === '…') return '<span class="pager__btn pager__ellipsis">' + ICON('fb-more-horizontal') + '</span>';
        return '<button type="button" class="pager__btn pager__pg' + (n === this._page ? ' is-active' : '') +
          '" data-pg="' + n + '"' + (n === this._page ? ' aria-current="page"' : '') + '>' + n + '</button>';
      }).join('');
      btns += '<button type="button" class="pager__btn" data-pg="next" aria-label="下一頁"' +
        (this._page >= last ? ' disabled' : '') + '>' + ICON('fb-chevron-right') + '</button>';

      var sizeOpts = this._sizes.map((s) =>
        '<option value="' + s + '"' + (s === this._pageSize ? ' selected' : '') + '>' + s + '</option>'
      ).join('');

      this.innerHTML =
        '<div class="pager__info">顯示第 ' + from + ' 到 ' + to + ' 筆，共 ' + this._total + ' 筆資料</div>' +
        '<div class="pager__num">' + btns + '</div>' +
        '<label class="pager__size">每頁顯示 <span class="pager__select"><select data-size>' + sizeOpts +
          '</select><span class="pager__caret">' + ICON('fb-chevron-down') + '</span></span> 筆</label>';
    }
  });

  function num(attr, cfg, dflt) {
    var v = attr != null ? parseInt(attr, 10) : (cfg != null ? parseInt(cfg, 10) : NaN);
    return isNaN(v) ? dflt : v;
  }

  /* =========================================================================
   * fb-tooltip — 溢出文字提示（單例、document 事件委派）
   * 帶 data-tip 的元素：hover / focus 顯示深底白字帶三角浮層。
   * 若元素本身有截斷樣式（ellipsis / -webkit-line-clamp），僅在文字實際溢出時顯示。
   * 
   * ====================================================================== */
  (function initTooltip() {
    if (!doc.body) { doc.addEventListener('DOMContentLoaded', initTooltip); return; }
    var tip = el('div', 'fb-tooltip');
    tip.setAttribute('role', 'tooltip');
    doc.body.appendChild(tip);
    var curr = null;

    function shouldShow(node) {
      var cs = global.getComputedStyle(node);
      var clamped = (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') ||
        cs.textOverflow === 'ellipsis';
      if (!clamped) return true;                       // 無截斷樣式 → 當一般提示，一律顯示
      return node.scrollWidth > node.clientWidth + 1 ||
        node.scrollHeight > node.clientHeight + 1;   // 有截斷 → 只在真的溢出時顯示
    }

    function place(node) {
      var r = node.getBoundingClientRect();
      var tr = tip.getBoundingClientRect();
      var below = false;
      var top = r.top - tr.height - 8;
      if (top < 4) { top = r.bottom + 8; below = true; }
      var left = Math.max(8, Math.min(
        r.left + (r.width - tr.width) / 2,
        global.innerWidth - tr.width - 8
      ));
      tip.style.top = (top + global.scrollY) + 'px';
      tip.style.left = (left + global.scrollX) + 'px';
      tip.classList.toggle('fb-tooltip--below', below);
      var cx = r.left + r.width / 2 - left;
      tip.style.setProperty('--tip-arrow-x', Math.max(12, Math.min(cx, tr.width - 12)) + 'px');
    }

    function show(node) {
      var text = node.getAttribute('data-tip');
      if (!text || !shouldShow(node)) return;
      curr = node;
      tip.textContent = text;
      tip.classList.add('is-shown');
      place(node);
    }
    function hide() { curr = null; tip.classList.remove('is-shown'); }

    doc.addEventListener('mouseover', function (e) {
      var n = e.target.closest && e.target.closest('[data-tip]');
      if (n && n !== curr) show(n);
    });
    doc.addEventListener('mouseout', function (e) {
      if (curr && (!e.relatedTarget || !curr.contains(e.relatedTarget))) hide();
    });
    doc.addEventListener('focusin', function (e) {
      var n = e.target.closest && e.target.closest('[data-tip]');
      if (n) show(n);
    });
    doc.addEventListener('focusout', hide);
    global.addEventListener('scroll', function () { if (curr) hide(); }, true);
    global.FbTooltip = { hide: hide };
  })();

  /* =========================================================================
   * fbSortRows(rows, { sort, sortVal, seq })
   * 管理列表共用排序：所有含「狀態（啟用／停用）」欄位的表格皆呼叫此函式。
   *   rows    — 已套用篩選的來源列陣列（不會被就地修改）
   *   sort    — null 或 { col, dir:'asc'|'desc' }，語意同各頁既有排序狀態
   *   sortVal — 欄位名 -> 取值函式（各頁自帶；若含 state 則以其判定啟用群組）
   *   seq     — 穩定序號的鍵名，預設 '_seq'（資料載入時一次性標記為原始索引）
   * 排序優先序：
   *   [1] 啟用列（active===true）永遠排在停用列之前，與是否點選欄位排序無關
   *   [2] 群組內套用 sort 指定欄位的比較與方向；未指定時維持來源順序
   *   [3] 一律以 seq 由小到大作為最終 tie-break，確保結果穩定且可重現
   * ====================================================================== */
  function fbSortRows(rows, opt) {
    opt = opt || {};
    var seq = opt.seq || '_seq';
    var sort = opt.sort || null;
    var sortVal = opt.sortVal || {};
    var stateOf = sortVal.state || function (r) { return r.active ? 0 : 1; };
    return rows.slice().sort(function (a, b) {
      var g = stateOf(a) - stateOf(b);            // [1] 啟用群組恆在上
      if (g) return g;
      if (sort && sortVal[sort.col]) {             // [2] 群組內欄位排序
        var va = sortVal[sort.col](a), vb = sortVal[sort.col](b);
        var d = typeof va === 'string' ? va.localeCompare(vb, 'zh-Hant') : va - vb;
        if (d) return sort.dir === 'asc' ? d : -d;
      }
      return (a[seq] || 0) - (b[seq] || 0);        // [3] 穩定最終鍵
    });
  }
  global.fbSortRows = fbSortRows;

  /* =========================================================================
   * fbLinkRange(startEl, endEl, { kind })
   * 綁定一組「起／訖」欄位（fb-date-field / fb-time-field / fb-datetime-field）使其互相約束：
   *   起欄位 change -> endEl.min   = startEl.value
   *   訖欄位 change -> startEl.max = endEl.value
   * 呼叫時立即以雙方目前值套用一次。kind（'date' | 'time'）目前僅作語意標記。
   * 如此使用者在 UI 上即無法選出「訖早於起」的組合。
   * ====================================================================== */
  function fbLinkRange(startEl, endEl) {
    if (!startEl || !endEl) return;
    var pushing = false;
    var applyMin = function () {
      if (!startEl.value) return;
      endEl.min = startEl.value;
      /* 起值超過訖值：推移訖值跟上，維持「訖不早於起」而不鎖死起欄位
         （日期為 YYYY/MM/DD、時間為 HH:MM，皆可字典序比較） */
      if (endEl.value && endEl.value < startEl.value) {
        pushing = true;
        endEl.value = startEl.value;
        endEl.dispatchEvent(new CustomEvent('change', { detail: { value: endEl.value }, bubbles: true }));
        pushing = false;
      }
    };
    /* 僅在使用者主動調整訖值時，才以訖值反向收斂起值上界；推移造成的 change 不算 */
    var applyMax = function () { if (!pushing && endEl.value) startEl.max = endEl.value; };
    startEl.addEventListener('change', applyMin);
    endEl.addEventListener('change', applyMax);
    /* 初始只套用下界（endEl.min）；不以預填的訖值回設 startEl.max，避免起訖預填等值時鎖死起欄位 */
    applyMin();
  }
  global.fbLinkRange = fbLinkRange;

})(window);

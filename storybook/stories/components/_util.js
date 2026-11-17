/** 把 args 轉成 HTML 屬性字串：true -> 布林屬性、false/空值 -> 省略 */
export const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== undefined && v !== null && v !== '')
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join(' ');

/** 內嵌 JSON 設定（元件於連線時讀取 <script type="application/json">） */
export const json = (o) => `<script type="application/json">${JSON.stringify(o)}</script>`;

/**
 * 屬性表（ArgsTable）定義：每列都有說明、預設值、分組，避免出現只有型別、預設值為「-」的空洞列。
 *   prop('說明', { category, def, type, control, options, name })
 */
export const prop = (description, { category = '內容', def, type, control, options, name, ...rest } = {}) => ({
  ...(name ? { name } : {}),
  description,
  ...(control !== undefined ? { control } : {}),
  ...(options ? { options } : {}),
  table: {
    category,
    ...(def !== undefined ? { defaultValue: { summary: String(def) } } : {}),
    ...(type ? { type: { summary: type } } : {}),
  },
  ...rest,
});

/** 事件列（無控制項）：顯示事件名稱與 detail 結構 */
export const event = (name, description, detail) => ({
  name,
  description,
  control: false,
  table: { category: '事件', type: { summary: detail || '—' } },
});

/** 方法列（無控制項） */
export const method = (name, description, signature) => ({
  name,
  description,
  control: false,
  table: { category: '方法', type: { summary: signature } },
});

/** 包一層容器並監聽元件事件，結果輸出到說明列 */
export const withLog = (markup, eventName, fmt = (e) => JSON.stringify(e.detail)) => {
  const wrap = document.createElement('div');
  wrap.innerHTML = `${markup}<p class="sb-note" data-log>（${eventName} 事件結果顯示於此）</p>`;
  const log = wrap.querySelector('[data-log]');
  wrap.addEventListener(eventName, (e) => {
    log.textContent = `${eventName}: ${fmt(e)}`;
  });
  return wrap;
};

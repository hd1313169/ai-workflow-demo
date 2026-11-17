import raw from '../../../design/tokens.json';

/** 全部 token：{ name, value, layer }；value 保留原始字串（可能是 var(--x) 參照） */
export const tokens = Object.entries(raw.tokens).map(([name, def]) => ({ name, ...def }));

export const byPrefix = (...prefixes) =>
  tokens.filter((t) => prefixes.some((p) => t.name === p || t.name.startsWith(p + '-')));

/** 瀏覽器解析後的實際值（var() 參照會被展開成最終值） */
export const resolved = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

/** 依 key 函式分組，保留首次出現順序 */
export const groupBy = (list, key) => {
  const map = new Map();
  for (const t of list) {
    const k = key(t);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(t);
  }
  return [...map.entries()];
};

/** 是否為 var(--x) 參照；是則回傳被參照的 token 名稱 */
export const refOf = (value) => {
  const m = /^var\(--([\w-]+)\)$/.exec(String(value).trim());
  return m ? m[1] : null;
};

export const px = (v) => parseFloat(v) || 0;

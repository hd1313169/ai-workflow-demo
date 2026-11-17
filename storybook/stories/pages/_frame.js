/**
 * 以 iframe 嵌入正式頁面（staticDirs 帶到產物 app/ 下），頁面原樣執行，
 * 頁內頂部導覽連結可在嵌入區直接切換。
 */
export const frame = (path, height = 1200) => () => {
  const el = document.createElement('iframe');
  el.src = `app/${path}`;
  el.title = path;
  el.loading = 'lazy';
  el.style.cssText = `width:100%;height:${height}px;border:0;display:block;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);background:var(--bg-page)`;
  return el;
};

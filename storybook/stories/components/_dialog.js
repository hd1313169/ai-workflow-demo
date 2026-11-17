/**
 * 對話框類 story 的共用骨架：觸發按鈕列 + 事件輸出列 + 對話框本體。
 *   buttons: [{ label, primary?, onClick(dlg) }]
 *   events:  要記錄的事件名稱；detail 會以 JSON 顯示
 */
export const dialogDemo = (tag, { buttons, events, attrs = '' }) => {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sb-row">
      ${buttons.map((b, i) => `<button class="${b.primary ? 'btn-primary' : 'btn-outline'}" data-i="${i}">${b.label}</button>`).join('')}
    </div>
    <p class="sb-note" data-log>（${events.join(' / ')} 結果顯示於此）</p>
    <${tag} ${attrs}></${tag}>`;
  const dlg = el.querySelector(tag);
  const log = el.querySelector('[data-log]');
  el.querySelectorAll('[data-i]').forEach((btn) =>
    btn.addEventListener('click', () => buttons[btn.dataset.i].onClick(dlg)),
  );
  events.forEach((name) =>
    dlg.addEventListener(name, (e) => {
      log.textContent = `${name}${e.detail ? ': ' + JSON.stringify(e.detail) : ''}`;
    }),
  );
  return el;
};

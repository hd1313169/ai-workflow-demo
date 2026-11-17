import { patternDoc, patternHeader } from './_doc.js';

const META = {
  purpose: '破壞性操作的兩段式流程：先以確認對話框說明後果，確認後以 toast 回報結果；取消則不打擾。',
  parts: ['fb-confirm-dialog', 'fb-toast', '.btn-danger-line'],
  usedIn: ['首頁（刪除行程）', '代理人設定（刪除代理）'],
};

export default {
  title: 'Patterns/刪除確認與回饋',
  tags: ['!autodocs'],
  parameters: { options: { showPanel: false }, docs: { description: { component: patternDoc(META) } } },
};

export const DeleteFlow = {
  name: '刪除確認與回饋',
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `${patternHeader(META)}
      <div class="sb-row">
        <span>客戶回訪 — 北辰科技　2026/08/07 14:00</span>
        <button class="btn-danger-line" data-del><fb-icon name="fb-trash"></fb-icon> 刪除 Delete</button>
      </div>
      <p class="sb-note" data-log>（confirm / cancel 結果顯示於此）</p>
      <fb-confirm-dialog></fb-confirm-dialog>
      <fb-toast></fb-toast>`;
    const dlg = el.querySelector('fb-confirm-dialog');
    const toast = el.querySelector('fb-toast');
    const log = el.querySelector('[data-log]');
    el.querySelector('[data-del]').addEventListener('click', () =>
      dlg.open({
        heading: '刪除行程',
        headingEn: 'Delete Schedule',
        title: '請確認是否要刪除行程',
        desc: '已刪除的行程將不會顯示在行事曆上',
        confirmLabel: '刪除',
        confirmLabelEn: 'Delete',
        tone: 'danger',
      }),
    );
    dlg.addEventListener('confirm', () => {
      log.textContent = 'confirm';
      toast.show('行程已刪除');
    });
    dlg.addEventListener('cancel', () => (log.textContent = 'cancel'));
    return el;
  },
};

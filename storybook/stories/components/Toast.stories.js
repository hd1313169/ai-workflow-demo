import { prop, method } from './_util.js';

export default {
  title: 'Components/Overlays/Toast',
  argTypes: {
    message: prop('主訊息', { type: 'string', def: '—' }),
    desc: prop('選填第二行說明', { type: 'string', def: '—' }),
    tone: prop('success＝成功、danger＝失敗', {
      category: '狀態', type: "'success' | 'danger'", def: "'success'", control: 'inline-radio', options: ['success', 'danger'],
    }),
    mShow: method('show()', '顯示通知，3.2 秒後自動消失', '(message, { tone?, desc? }) => void'),
  },
  args: { message: '資料已匯出', desc: '檔案已儲存至下載資料夾', tone: 'success' },
  parameters: {
    docs: { description: { component: '`<fb-toast>` 右上角短暫通知（3.2 秒自動消失）。方法：`show(message, { tone, desc })`。' } },
  },
  render: ({ message, desc, tone }) => {
    const el = document.createElement('div');
    el.innerHTML = `<div class="sb-row">
        <button class="btn-outline" data-show>顯示 toast</button>
        <button class="btn-outline" data-danger>顯示失敗 toast</button>
      </div><fb-toast></fb-toast>`;
    const toast = el.querySelector('fb-toast');
    el.querySelector('[data-show]').addEventListener('click', () =>
      toast.show(message, desc ? { tone, desc } : { tone }),
    );
    el.querySelector('[data-danger]').addEventListener('click', () =>
      toast.show('資料匯出失敗', { tone: 'danger', desc: '請稍後再試，或縮小查詢範圍後重新匯出' }),
    );
    return el;
  },
};

export const Default = {};

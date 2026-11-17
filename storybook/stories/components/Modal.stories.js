import { prop, event, method } from './_util.js';

export default {
  title: 'Components/Overlays/Modal',
  argTypes: {
    heading: prop('標題（中文）', { type: 'string', def: "''" }),
    headingEn: prop('標題（英文，次要字色）', { name: 'heading-en', type: 'string', def: "''" }),
    footer: prop('子元素加上 data-modal-footer 會移入固定 footer', { type: 'slot', def: '—', control: false }),
    mOpen: method('open()', '開啟對話框', '() => void'),
    mClose: method('close()', '關閉對話框', '() => void'),
    mHeading: method('setHeading()', '動態更換標題', '(zh, en) => void'),
    onOpen: event('modal-open', '開啟後觸發'),
    onClose: event('modal-close', '關閉後觸發（含點遮罩、×、data-modal-cancel）'),
  },
  args: { heading: '範例 Modal', headingEn: 'Example Modal' },
  parameters: {
    docs: {
      description: {
        component:
          '`<fb-modal>` 通用對話框外殼：遮罩、可捲動內文、固定 footer。方法：`open()`／`close()`；事件：`modal-open`／`modal-close`。',
      },
    },
  },
  render: ({ heading, headingEn }) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <button class="btn-primary" data-open><fb-icon name="fb-plus"></fb-icon> 開啟 Modal</button>
      <p class="sb-note" data-log>（modal-open / modal-close 顯示於此）</p>
      <fb-modal heading="${heading}" heading-en="${headingEn}">
        <p>這是 Modal 的內文區（可捲動），可放入表單或其他元件。</p>
        <div data-modal-footer style="display:flex;justify-content:flex-end;gap:8px;width:100%">
          <button class="btn-neutral-outline" data-modal-cancel>取消 Cancel</button>
          <button class="btn-primary" data-modal-close>確定 OK</button>
        </div>
      </fb-modal>`;
    const modal = el.querySelector('fb-modal');
    const log = el.querySelector('[data-log]');
    el.querySelector('[data-open]').addEventListener('click', () => modal.open());
    modal.addEventListener('modal-open', () => (log.textContent = 'modal-open'));
    modal.addEventListener('modal-close', () => (log.textContent = 'modal-close'));
    return el;
  },
};

export const Default = {};

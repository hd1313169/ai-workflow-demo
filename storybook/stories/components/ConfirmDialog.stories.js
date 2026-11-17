import { prop, event, method } from './_util.js';
import { dialogDemo } from './_dialog.js';

export default {
  title: 'Components/Overlays/ConfirmDialog',
  argTypes: {
    heading: prop('對話框標題（中文）', { type: 'string', def: '—' }),
    title: prop('內文主句', { type: 'string', def: '—' }),
    desc: prop('內文補充說明', { type: 'string', def: '—' }),
    tone: prop('danger 時確認鈕為紅框（破壞性操作）', {
      category: '狀態', type: "'default' | 'danger'", def: "'default'", control: 'inline-radio', options: ['default', 'danger'],
    }),
    mOpen: method('open()', '以設定開啟；以上屬性皆由此傳入', '({ heading, headingEn, title, desc, confirmLabel, confirmLabelEn, tone }) => void'),
    onConfirm: event('confirm', '按下確認鈕'),
    onCancel: event('cancel', '按取消、× 或遮罩'),
  },
  args: { heading: '刪除行程', title: '請確認是否要刪除行程', desc: '已刪除的行程將不會顯示在行事曆上', tone: 'danger' },
  parameters: {
    docs: { description: { component: '`<fb-confirm-dialog>` 通用確認對話框，所有內容在 `open()` 時傳入，同一個實例可重複使用。' } },
  },
  render: ({ heading, title, desc, tone }) =>
    dialogDemo('fb-confirm-dialog', {
      events: ['confirm', 'cancel'],
      buttons: [
        {
          label: '開啟確認對話框',
          primary: true,
          onClick: (d) =>
            d.open({ heading, headingEn: 'Delete Schedule', title, desc, confirmLabel: '刪除', confirmLabelEn: 'Delete', tone }),
        },
      ],
    }),
};

export const Playground = {};

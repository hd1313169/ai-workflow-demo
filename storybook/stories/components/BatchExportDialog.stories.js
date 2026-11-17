import { prop, event, method } from './_util.js';
import { dialogDemo } from './_dialog.js';

export default {
  title: 'Components/Overlays/BatchExportDialog',
  argTypes: {
    count: prop('要匯出的資料筆數', { type: 'number', def: '—', control: { type: 'number', min: 1, step: 500 } }),
    limit: prop('單次下載上限；超過時分批，批數＝ceil(count / limit)', { type: 'number', def: 2000, control: { type: 'number', min: 100, step: 100 } }),
    mOpen: method('open()', '開啟', '({ count, limit? }) => void'),
    onExport: event('export', '按下載／分批下載', '{ count, limit, batches }'),
    onCancel: event('cancel', '按取消、× 或 Esc（點遮罩不關閉）'),
  },
  args: { count: 10000, limit: 2000 },
  parameters: {
    docs: {
      description: {
        component: '`<fb-batch-export-dialog>` 批次匯出對話框：未超過上限時直接下載；超過時顯示批數與每批筆數，主按鈕改為「分批下載」。',
      },
    },
  },
  render: ({ count, limit }) =>
    dialogDemo('fb-batch-export-dialog', {
      events: ['export', 'cancel'],
      buttons: [
        { label: `開啟（${count.toLocaleString()} 筆）`, primary: true, onClick: (d) => d.open({ count, limit }) },
        { label: '開啟（1,500 筆，未超上限）', onClick: (d) => d.open({ count: 1500, limit }) },
      ],
    }),
};

export const Playground = {};

import { prop, event, method } from './_util.js';
import { dialogDemo } from './_dialog.js';

export default {
  title: 'Components/Overlays/ExportDialog',
  argTypes: {
    time: prop('報表時間維度', { type: "'monthly' | 'weekly'", def: "'monthly'", control: false }),
    metrics: prop('統計比較指標（可多選）', { type: "('mtd'|'ytd'|'mom'|'yoy'|'monthlyize')[]", def: '全選', control: false }),
    detailLevel: prop('客戶明細層級；選帳號明細時彙總計算強制取消並停用', {
      type: "'affiliate' | 'category' | 'household' | 'account'", def: "'affiliate'", control: false,
    }),
    marketShareMode: prop('佔比指標模式：月化選項停用並顯示提示', { category: '狀態', type: 'boolean', def: false, control: false }),
    partialMonthMode: prop('非整月簡化模式：頂部警告，時間與指標兩區停用', { category: '狀態', type: 'boolean', def: false, control: false }),
    mOpen: method('open()', '以設定開啟；以上屬性皆由此傳入', '(config?) => void'),
    onExport: event('export', '按匯出（約 0.8 秒 loading 後關閉）', '{ time, metrics, detailLevel, summary }'),
    onCancel: event('cancel', '按取消或 ×'),
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<fb-export-dialog>` 自訂匯出報表對話框：時間維度、比較指標、明細層級、彙總計算四區，區塊之間有連動規則。',
      },
    },
  },
  render: () =>
    dialogDemo('fb-export-dialog', {
      events: ['export', 'cancel'],
      buttons: [
        { label: '開啟（預設）', primary: true, onClick: (d) => d.open() },
        { label: '開啟（佔比指標）', onClick: (d) => d.open({ marketShareMode: true }) },
        { label: '開啟（非整月簡化）', onClick: (d) => d.open({ partialMonthMode: true }) },
      ],
    }),
};

export const Default = {};

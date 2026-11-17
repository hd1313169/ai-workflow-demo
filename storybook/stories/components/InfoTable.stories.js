import { json, prop } from './_util.js';

export default {
  title: 'Components/Data Display/InfoTable',
  render: ({ rows }) => `<div style="max-width: 640px"><fb-info-table>${json(rows)}</fb-info-table></div>`,
  argTypes: {
    rows: prop('資料列；value 為空字串時顯示「-」', { type: '[{ label, value }]', def: '[]', control: 'object' }),
  },
  args: {
    rows: [
      { label: '操作時間', value: '2026/08/27 18:30' },
      { label: '執行者', value: '859230-王小明' },
      { label: '代理人', value: '' },
      { label: '執行者 IP', value: '192.168.9.30' },
      { label: '執行功能', value: '日誌資料匯出' },
      { label: 'Trace Id', value: '123e4567-e89b-12d3-a456-426614174000' },
      { label: 'Status Message', value: '{ "code": 400, "message": "Invalid input format." }' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: '`<fb-info-table>` 唯讀的 label／value 兩欄資訊表：label 固定寬、value 可換行、相鄰列交錯底色。用於明細檢視。',
      },
    },
  },
};

export const Playground = {};

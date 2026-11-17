import { json, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Navigation/CardTabs',
  render: ({ active, badge }) =>
    withLog(
      `<div style="background: var(--bg-surface)"><fb-card-tabs active="${active}">${json([
        { zh: '客戶列表', en: 'Customer List' },
        { zh: '行事曆', en: 'Calendar' },
        { zh: '服務通知', en: 'Service Notice', badge },
      ])}</fb-card-tabs></div>`,
      'tab-change',
    ),
  argTypes: {
    active: prop('目前分頁索引（從 0 開始）', { category: '狀態', type: 'number', def: 0, control: { type: 'number', min: 0, max: 2 } }),
    badge: prop('分頁徽章數字；0 或未設定時不顯示', { type: 'number', def: '不顯示', control: { type: 'number', min: 0 } }),
    onTabChange: event('tab-change', '切換分頁時觸發', '{ index }'),
  },
  args: { active: 1, badge: 2 },
  parameters: {
    docs: { description: { component: '`<fb-card-tabs>` 卡片頂部分頁：灰底軌、白底選中＋主色底線，項目可帶紅底數字徽章。' } },
  },
};

export const Playground = {};

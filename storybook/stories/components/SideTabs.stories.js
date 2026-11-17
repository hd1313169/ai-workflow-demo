import { json, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Navigation/SideTabs',
  render: ({ active }) =>
    withLog(
      `<div style="width: 160px; background: var(--bg-surface)"><fb-side-tabs active="${active}">${json([
        { zh: '客戶', en: 'Client' },
        { zh: '研究員', en: 'Analyst' },
      ])}</fb-side-tabs></div>`,
      'tab-change',
    ),
  argTypes: {
    active: prop('目前分頁索引（從 0 開始）', { category: '狀態', type: 'number', def: 0, control: { type: 'number', min: 0, max: 1 } }),
    onTabChange: event('tab-change', '切換分頁時觸發', '{ index }'),
  },
  args: { active: 0 },
  parameters: {
    docs: { description: { component: '`<fb-side-tabs>` 直式分頁，用於「左側切換、右側主要內容」版型（服務紀錄總表）。' } },
  },
};

export const Playground = {};

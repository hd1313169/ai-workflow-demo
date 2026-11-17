import { json, prop, event, withLog } from './_util.js';

const TABS = [
  { zh: '分頁一', en: 'Tab One' },
  { zh: '分頁二', en: 'Tab Two' },
  { zh: '分頁三', en: 'Tab Three' },
];

export default {
  title: 'Components/Navigation/TabBar',
  render: ({ active }) => withLog(`<fb-tabbar active="${active}">${json(TABS)}</fb-tabbar>`, 'tab-change'),
  argTypes: {
    active: prop('目前分頁索引（從 0 開始）', {
      category: '狀態', type: 'number', def: 0, control: { type: 'number', min: 0, max: TABS.length - 1 },
    }),
    tabs: prop('分頁項目，以內嵌 JSON 提供；帶 href 的項目點擊後導向該頁', {
      type: '[{ zh, en, href? }]', def: '[]', control: false,
    }),
    onTabChange: event('tab-change', '切換分頁時觸發（href 項目不觸發）', '{ index }'),
  },
  args: { active: 0 },
  parameters: { docs: { description: { component: '`<fb-tabbar>` 頁面層級的水平分頁列，主色底線標示目前分頁。' } } },
};

export const Playground = {};

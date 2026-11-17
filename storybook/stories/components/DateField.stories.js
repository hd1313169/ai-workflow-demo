import { attrs, prop, event } from './_util.js';

export default {
  title: 'Components/Forms/DateField',
  render: (a) => `<div style="max-width: 280px; min-height: 380px"><fb-date-field ${attrs(a)}></fb-date-field></div>`,
  argTypes: {
    value: prop('日期，格式 YYYY/MM/DD', { type: 'string', def: '今天' }),
    min: prop('可選的最早日期，之前的日期停用', { category: '狀態', type: 'string', def: '不限' }),
    max: prop('可選的最晚日期，之後的日期停用', { category: '狀態', type: 'string', def: '不限' }),
    onChange: event('change', '選定日期時觸發', '{ value }'),
  },
  args: { value: '2026/08/15', min: '', max: '' },
  parameters: {
    docs: { description: { component: '`<fb-date-field>` 日期欄位，點擊展開月曆；可用 `min`／`max` 限制範圍。' } },
  },
};

export const Playground = {};
export const Range = { name: '限制可選範圍', args: { value: '2026/08/15', min: '2026/08/10', max: '2026/08/25' } };

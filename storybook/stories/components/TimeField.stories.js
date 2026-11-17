import { attrs, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Forms/TimeField',
  render: (a) => withLog(`<div style="max-width: 240px; min-height: 300px"><fb-time-field ${attrs(a)}></fb-time-field></div>`, 'change'),
  argTypes: {
    value: prop('時間，格式 HH:MM', { type: 'string', def: "'00:00'" }),
    min: prop('可選的最早時間；設定後步進到邊界即停止，不迴繞', { category: '狀態', type: 'string', def: '不限' }),
    max: prop('可選的最晚時間', { category: '狀態', type: 'string', def: '不限' }),
    onChange: event('change', '時間變更時觸發', '{ value: "HH:MM" }'),
  },
  args: { value: '09:00', min: '', max: '' },
  parameters: {
    docs: { description: { component: '`<fb-time-field>` 時間欄位：展開後以時／分上下步進。起訖成對時可用 `fbLinkRange` 綁定。' } },
  },
};

export const Playground = {};
export const Bounded = { name: '限制範圍', args: { value: '17:00', min: '09:00', max: '17:30' } };

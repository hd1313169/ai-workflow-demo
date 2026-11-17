import { attrs, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Forms/DateTimeField',
  render: (a) =>
    withLog(`<div style="max-width: 300px; min-height: 460px"><fb-datetime-field ${attrs(a)}></fb-datetime-field></div>`, 'change'),
  argTypes: {
    value: prop('日期時間，格式 YYYY/MM/DD HH:MM；空值顯示 placeholder', { type: 'string', def: "''" }),
    placeholder: prop('空值時的提示文字', { type: 'string', def: "'請選擇'" }),
    min: prop('可選的最早日期時間', { category: '狀態', type: 'string', def: '不限' }),
    max: prop('可選的最晚日期時間', { category: '狀態', type: 'string', def: '不限' }),
    onChange: event('change', '按「確認」或「清除」時觸發', '{ value }'),
  },
  args: { value: '2025/09/17 15:26', placeholder: '請選擇', min: '', max: '' },
  parameters: {
    docs: { description: { component: '`<fb-datetime-field>` 日期＋時間複合欄位：選日、時分步進，按確認才套用。' } },
  },
};

export const Playground = {};
export const Empty = { name: '空值', args: { value: '' } };

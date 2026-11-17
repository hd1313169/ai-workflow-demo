import { attrs, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Forms/IconToggle',
  render: ({ on, disabled, offIcon, onIcon }) =>
    withLog(
      `<span style="font-size: 24px">
        <fb-icon-toggle ${attrs({ on, disabled, 'off-icon': offIcon, 'on-icon': onIcon })}></fb-icon-toggle>
      </span>`,
      'change',
    ),
  argTypes: {
    offIcon: prop('關閉狀態圖示', { name: 'off-icon', type: 'string', def: '—' }),
    onIcon: prop('開啟狀態圖示', { name: 'on-icon', type: 'string', def: '—' }),
    on: prop('開啟狀態', { category: '狀態', type: 'boolean', def: false }),
    disabled: prop('停用', { category: '狀態', type: 'boolean', def: false }),
    onChange: event('change', '切換時觸發', '{ on }'),
  },
  args: { on: false, disabled: false, offIcon: 'fb-star-outline', onIcon: 'fb-star-filled' },
  parameters: {
    docs: { description: { component: '`<fb-icon-toggle>` 單一圖示兩態切換鈕，例如行事曆的「追蹤 F/U」星號。' } },
  },
};

export const Playground = {};

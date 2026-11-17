import { attrs, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Atoms/Toggle',
  render: (a) => withLog(`<fb-toggle ${attrs(a)}></fb-toggle>`, 'change'),
  argTypes: {
    checked: prop('開啟狀態', { category: '狀態', type: 'boolean', def: false }),
    disabled: prop('停用：不可切換、降低對比', { category: '狀態', type: 'boolean', def: false }),
    variant: prop('外觀：空值為純開關；card 為含標題與說明的卡片', {
      type: "'' | 'card'", def: "''", control: 'inline-radio', options: ['', 'card'],
    }),
    zh: prop('卡片標題（中文）', { type: 'string', def: '—', if: { arg: 'variant', eq: 'card' } }),
    en: prop('卡片標題（英文，次要字色）', { type: 'string', def: '—', if: { arg: 'variant', eq: 'card' } }),
    desc: prop('卡片說明文字', { type: 'string', def: '—', if: { arg: 'variant', eq: 'card' } }),
    onChange: event('change', '切換時觸發', '{ checked: boolean }'),
  },
  args: { checked: true, disabled: false, variant: '' },
  parameters: { docs: { description: { component: '`<fb-toggle>` 開關。事件：`change { checked }`。' } } },
};

export const Playground = {};

export const Card = {
  name: '卡片版',
  args: {
    variant: 'card',
    zh: '啟用此角色',
    en: 'Active Status',
    desc: '停用後已指派此角色的使用者將暫時無法使用相關功能',
  },
};

export const States = {
  name: '所有狀態',
  render: () => `<div class="sb-row">
    <fb-toggle checked></fb-toggle><fb-toggle></fb-toggle>
    <fb-toggle checked disabled></fb-toggle><fb-toggle disabled></fb-toggle>
  </div>`,
};

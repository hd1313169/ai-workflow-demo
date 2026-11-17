import { attrs, prop } from './_util.js';

export default {
  title: 'Components/Atoms/Chip',
  render: ({ label, active, closable }) => `<fb-chip ${attrs({ label, active, closable })}></fb-chip>`,
  argTypes: {
    label: prop('標籤文字；未設定時取元素內文', { type: 'string', def: '（元素內文）' }),
    active: prop('選中狀態：主色底、反白字', { category: '狀態', type: 'boolean', def: false }),
    closable: prop('顯示 × 關閉鈕，點擊後移除自身', { category: '狀態', type: 'boolean', def: false }),
  },
  args: { label: '科技業', active: true, closable: true },
  parameters: { docs: { description: { component: '`<fb-chip>` 篩選標籤。用於篩選條件摘要，可選中、可關閉。' } } },
};

export const Playground = {};

export const States = {
  name: '所有狀態',
  render: () => `<div class="sb-row">
    <fb-chip label="未選"></fb-chip>
    <fb-chip label="選中" active></fb-chip>
    <fb-chip label="可關閉" closable></fb-chip>
    <fb-chip label="選中＋可關閉" active closable></fb-chip>
    <fb-chip label="集團戶, 客戶類型, 科技業, 迅捷物流" active closable></fb-chip>
  </div>`,
};

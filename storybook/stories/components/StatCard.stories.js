import { attrs, prop } from './_util.js';

export default {
  title: 'Components/Data Display/StatCard',
  render: (a) => `<div style="max-width: 360px"><fb-stat-card ${attrs(a)}></fb-stat-card></div>`,
  argTypes: {
    zh: prop('標題（中文）', { type: 'string', def: "''" }),
    en: prop('標題（英文，次要字色）', { type: 'string', def: "''" }),
    value: prop('大數字', { type: 'string', def: "''" }),
    icon: prop('圖示徽章，icons registry 名稱', {
      type: 'string', def: "'fb-user'", control: 'select', options: ['fb-user', 'fb-check-circle-filled', 'fb-refresh-cw', 'fb-clock'],
    }),
    tone: prop('徽章色調', {
      category: '狀態', type: "'' | 'success' | 'warning'", def: '主色', control: 'inline-radio', options: ['', 'success', 'warning'],
    }),
  },
  args: { zh: '系統總角色數', en: 'Total Roles', value: '6', icon: 'fb-user', tone: '' },
  parameters: { docs: { description: { component: '`<fb-stat-card>` 純展示統計卡：圖示徽章 + 中英標題 + 大數字，用於清單頁頂部摘要。' } } },
};

export const Playground = {};

export const Row = {
  name: '並排摘要列',
  render: () => `<div class="sb-row" style="align-items: stretch">
    <div class="sb-col"><fb-stat-card icon="fb-user" zh="系統總角色數" en="Total Roles" value="6"></fb-stat-card></div>
    <div class="sb-col"><fb-stat-card tone="success" icon="fb-check-circle-filled" zh="啟用中角色" en="Active Roles" value="5"></fb-stat-card></div>
    <div class="sb-col"><fb-stat-card tone="warning" icon="fb-refresh-cw" zh="目前代理中人數" en="Delegating Users" value="4"></fb-stat-card></div>
  </div>`,
};

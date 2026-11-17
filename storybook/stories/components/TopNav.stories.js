import { attrs, prop } from './_util.js';

export default {
  title: 'Components/Navigation/TopNav',
  render: (a) => `<fb-topnav ${attrs(a)}></fb-topnav>`,
  argTypes: {
    active: prop('目前所在的主選單', {
      category: '狀態', type: "'home' | 'customer' | 'marketing' | 'report-zone' | 'tools'", def: '—',
      control: 'inline-radio', options: ['home', 'customer', 'marketing', 'report-zone', 'tools'],
    }),
    brand: prop('左側品牌文字', { type: 'string', def: "'業務管理系統'" }),
  },
  args: { active: 'report-zone', brand: '' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '`<fb-topnav>` 全站頂部導覽：品牌、主選單（滑過展開子選單）、全域搜尋、使用者。選單結構集中定義於元件內。',
      },
    },
  },
};

export const Playground = {};

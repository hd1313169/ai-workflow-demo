import { attrs, prop } from './_util.js';

export default {
  title: 'Components/Navigation/AreaTitle',
  render: (a) => `<fb-area-title ${attrs(a)}></fb-area-title>`,
  argTypes: {
    zh: prop('標題（中文）', { type: 'string', def: "''" }),
    en: prop('標題（英文，次要字色）', { type: 'string', def: "''" }),
    icon: prop('選填圖示徽章，icons registry 名稱', {
      type: 'string', def: '無', control: 'select', options: ['', 'fb-calendar', 'fb-user', 'fb-search'],
    }),
  },
  args: { zh: '境內客戶報表', en: 'Domestic Client Report', icon: '' },
  parameters: { docs: { description: { component: '`<fb-area-title>` 頁面或區塊標題：中文主標 + 英文副標，可加圖示徽章。' } } },
};

export const Playground = {};
export const WithIcon = { name: '含圖示', args: { zh: '個人行事曆', en: 'Personal Calendar', icon: 'fb-calendar' } };

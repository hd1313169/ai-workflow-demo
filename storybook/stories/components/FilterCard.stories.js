import { json, prop } from './_util.js';

export default {
  title: 'Components/Composite/FilterCard',
  argTypes: {
    content: prop('子節點原樣包進卡片；欄位用 .filter__grid（cols-3 / cols-5）排版', {
      type: 'slot', def: '—', control: false,
    }),
    cols: prop('欄位網格欄數（.filter__grid 的修飾 class）', {
      type: "'cols-3' | 'cols-5'", def: '—', control: 'inline-radio', options: ['cols-3', 'cols-5'],
    }),
  },
  args: { cols: 'cols-3' },
  parameters: {
    docs: {
      description: {
        component: '`<fb-filter-card>` 篩選區外殼：只負責白卡、圓角、陰影與內距，內容自由組合。完整組法見 Patterns／篩選區。',
      },
    },
  },
  render: ({ cols }) => `<div style="min-height: 360px">
    <fb-filter-card>
      <div class="filter__grid ${cols}">
        <div class="field"><label>單選 <span class="en">Single</span></label>
          <fb-dropdown type="single">${json({ options: ['甲', '乙', '丙'], value: '甲' })}</fb-dropdown></div>
        <div class="field"><label>多選＋搜尋 <span class="en">Multi</span></label>
          <fb-dropdown type="multi" search>${json({ options: ['科技業', '製造業', '金融業', '物流業'] })}</fb-dropdown></div>
        <div class="field"><label>日期 <span class="en">Date</span></label>
          <fb-date-field value="2026/01/15"></fb-date-field></div>
        <div class="field"><label>關鍵字 <span class="en">Keyword</span></label>
          <input class="text-input" placeholder="請輸入關鍵字"></div>
      </div>
    </fb-filter-card>
  </div>`,
};

export const Playground = {};

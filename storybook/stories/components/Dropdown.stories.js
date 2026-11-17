import { attrs, json, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Forms/Dropdown',
  render: ({ type, search, placeholder, options }) =>
    withLog(
      `<div style="max-width: 320px"><fb-dropdown ${attrs({ type, search, placeholder })}>${json({ options })}</fb-dropdown></div>`,
      'change',
    ),
  argTypes: {
    type: prop('single＝單選、multi＝多選（含全選）', {
      type: "'single' | 'multi'", def: "'single'", control: 'inline-radio', options: ['single', 'multi'],
    }),
    options: prop('選項清單，以內嵌 JSON 提供', { type: 'string[]', def: '[]', control: 'object' }),
    placeholder: prop('未選取時的提示文字', { type: 'string', def: "'請選擇'" }),
    search: prop('下拉面板頂端顯示搜尋框', { category: '狀態', type: 'boolean', def: false }),
    onChange: event('change', '選取變更時觸發', '{ value }'),
  },
  args: { type: 'multi', search: true, placeholder: '請選擇', options: ['科技業', '製造業', '金融業', '物流業', '零售業'] },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '`<fb-dropdown>` 單選／多選下拉，可加搜尋。選項與預設值以內嵌 JSON 設定。' } },
  },
};

export const Playground = {};

export const Variants = {
  name: '變體一覽',
  render: () => `<div class="sb-row" style="align-items:flex-start; min-height: 320px">
    <div class="sb-col"><small>single</small>
      <fb-dropdown type="single">${json({ options: ['交易量', '淨收益', '佔比'], value: '淨收益' })}</fb-dropdown></div>
    <div class="sb-col"><small>multi（預設全選）</small>
      <fb-dropdown type="multi">${json({ options: ['標準方案', '進階方案', '企業方案'] })}</fb-dropdown></div>
    <div class="sb-col"><small>multi + search（清空）</small>
      <fb-dropdown type="multi" search placeholder="請選擇">${json({ options: ['A', 'B', 'C', 'D'], value: [] })}</fb-dropdown></div>
  </div>`,
};

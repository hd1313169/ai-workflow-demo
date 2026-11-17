import { attrs, prop, event, withLog } from './_util.js';

export default {
  title: 'Components/Forms/Pagination',
  render: ({ total, page, pageSize }) =>
    withLog(`<fb-pagination ${attrs({ total, page, 'page-size': pageSize })}></fb-pagination>`, 'page-change'),
  argTypes: {
    total: prop('資料總筆數', { type: 'number', def: 0, control: { type: 'number', min: 0, step: 5 } }),
    pageSize: prop('每頁筆數，須為 sizes 其中之一', {
      name: 'page-size', type: 'number', def: 'sizes 第一個', control: 'select', options: [20, 50, 100],
    }),
    sizes: prop('每頁筆數下拉選項（逗號分隔）', { type: 'string', def: "'20,50,100'", control: false }),
    page: prop('目前頁碼', { category: '狀態', type: 'number', def: 1, control: { type: 'number', min: 1 } }),
    onPageChange: event('page-change', '換頁或改每頁筆數時觸發（改筆數會回到第 1 頁）', '{ page, pageSize }'),
  },
  args: { total: 95, page: 1, pageSize: 20 },
  parameters: {
    docs: {
      description: {
        component: '`<fb-pagination>` 表格分頁列：資訊列 + 頁碼（含省略號）+ 每頁筆數。事件：`page-change { page, pageSize }`。',
      },
    },
  },
};

export const Playground = {};
export const ManyPages = { name: '大量頁數（省略號）', args: { total: 980, page: 12, pageSize: 20 } };
export const SinglePage = { name: '單頁', args: { total: 8 } };

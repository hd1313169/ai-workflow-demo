import { frame } from './_frame.js';

export default {
  title: 'Pages/首頁',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
};

export const Calendar = {
  name: '個人行事曆',
  render: frame('index.html', 1100),
  parameters: { docs: { description: { story: '月曆、行程清單、客戶列表與服務通知分頁。' } } },
};

import { frame } from './_frame.js';

export default {
  title: 'Pages/報表',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
};

export const Domestic = {
  name: '境內客戶報表',
  render: frame('pages/domestic_basic_report.html', 1400),
  parameters: { docs: { description: { story: '篩選區、年度／月份展開收合、凍結欄、排序、匯出對話框。' } } },
};

export const Overseas = {
  name: '境外客戶報表',
  render: frame('pages/foreign_basic_report.html', 1400),
  parameters: { docs: { description: { story: '在境內報表基礎上多一層境外分類。' } } },
};

export const ServiceRecords = {
  name: '服務紀錄',
  render: frame('pages/service_records.html', 1200),
  parameters: { docs: { description: { story: '總表／明細切換、圖表與排名表。' } } },
};

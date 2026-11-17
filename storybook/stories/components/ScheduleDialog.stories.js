import { prop, event, method } from './_util.js';
import { dialogDemo } from './_dialog.js';

export default {
  title: 'Components/Overlays/ScheduleDialog',
  argTypes: {
    mode: prop('timed＝指定起訖時間、allday＝全天', {
      category: '狀態', type: "'timed' | 'allday'", def: "'timed'", control: false,
    }),
    mOpen: method('open()', '開啟；可帶入既有行程資料（編輯）', '({ allDay, startDate, endDate, start?, end?, title?, note? }?) => void'),
    mClose: method('close()', '關閉', '() => void'),
    onSubmit: event('submit', '按新增／儲存', '{ id, title, allDay, startDate, endDate, start, end, note }'),
    onCancel: event('cancel', '按取消或 ×'),
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<fb-schedule-dialog>` 新增／編輯行程對話框：標題、全天切換、起訖日期時間、備註（字數上限）。日期與時間的浮層掛在 body 上，不會被對話框裁切。',
      },
    },
  },
  render: () =>
    dialogDemo('fb-schedule-dialog', {
      attrs: 'mode="timed"',
      events: ['submit', 'cancel'],
      buttons: [
        {
          label: '新增行程（計時）',
          primary: true,
          onClick: (d) => {
            d.setAttribute('mode', 'timed');
            d.open({ allDay: false, startDate: '2026/08/24', endDate: '2026/08/24', start: '09:00', end: '10:00' });
          },
        },
        {
          label: '新增行程（全天）',
          onClick: (d) => {
            d.setAttribute('mode', 'allday');
            d.open({ allDay: true, startDate: '2026/08/24', endDate: '2026/08/25' });
          },
        },
      ],
    }),
};

export const Default = {};

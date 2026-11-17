import { json, prop, event, method, withLog } from './_util.js';

const EVENTS = [
  { date: '2026/08/01', kinds: ['service'] },
  { date: '2026/08/07', kinds: ['personal', 'service', 'event'] },
  { date: '2026/08/17', kinds: ['personal', 'event'] },
  { date: '2026/08/24', kinds: ['personal', 'service', 'event'] },
  { date: '2026/08/28', kinds: ['service'] },
];

export default {
  title: 'Components/Forms/MiniCalendar',
  render: ({ value, month }) =>
    withLog(
      `<div style="max-width: 520px"><fb-mini-calendar value="${value}" month="${month}">${json({ events: EVENTS })}</fb-mini-calendar></div>`,
      'date-change',
    ),
  argTypes: {
    value: prop('選取日期，格式 YYYY/MM/DD', { category: '狀態', type: 'string', def: '今天' }),
    month: prop('顯示月份，格式 YYYY/MM', { category: '狀態', type: 'string', def: 'value 所在月份' }),
    events: prop('每日事件點（每日最多 3 個），以內嵌 JSON 提供', {
      type: "[{ date, kinds: ('personal'|'service'|'event')[] }]", def: '[]', control: false,
    }),
    mMonth: method('setMonth()', '切換顯示月份', '(YYYY/MM) => void'),
    mToday: method('goToday()', '回到今天', '() => void'),
    onDateChange: event('date-change', '點選日期時觸發', '{ value }'),
    onMonthChange: event('month-change', '切換月份時觸發', '{ month }'),
  },
  args: { value: '2026/08/24', month: '2026/08' },
  parameters: {
    docs: { description: { component: '`<fb-mini-calendar>` 月曆：今日標示、選取日、每日以色點標示行程類型。' } },
  },
};

export const Playground = {};

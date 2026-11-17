import { json, prop, event, withLog } from './_util.js';

const OPTIONS = [
  { value: 'personal', label: '個人 Personal' },
  { value: 'service', label: '服務 Service' },
  { value: 'event', label: '活動 Event' },
];

export default {
  title: 'Components/Atoms/Segmented',
  render: ({ value }) => withLog(`<fb-segmented value="${value}">${json(OPTIONS)}</fb-segmented>`, 'change'),
  argTypes: {
    value: prop('目前選取的選項 value', {
      category: '狀態', type: 'string', def: '第一個選項', control: 'inline-radio', options: OPTIONS.map((o) => o.value),
    }),
    options: prop('選項清單，以內嵌 JSON 提供', { type: '[{ value, label, disabled? }]', def: '—', control: false }),
    onChange: event('change', '切換選項時觸發', '{ value }'),
  },
  args: { value: 'personal' },
  parameters: {
    docs: { description: { component: '`<fb-segmented>` 分段控制（單選）。選項以內嵌 JSON 設定，事件：`change { value }`。' } },
  },
};

export const Playground = {};

export const WithDisabled = {
  name: '含停用項目',
  render: () =>
    `<fb-segmented value="總表">${json([{ zh: '總表', en: 'Summary' }, { zh: '明細', en: 'Details', disabled: true }])}</fb-segmented>`,
};

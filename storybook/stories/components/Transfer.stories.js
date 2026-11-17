import { attrs, json, prop, event, method, withLog } from './_util.js';

const ITEMS = [
  { id: 'n1', label: 'N01 北區分部' },
  { id: 'n2', label: 'N02 中區分部' },
  { id: 'n3', label: 'N03 南區分部' },
  { id: 'b1', label: 'B01 東區分公司' },
  { id: 'b2', label: 'B02 西區分公司' },
  { id: 'b3', label: 'B03 離島分公司' },
];

export default {
  title: 'Components/Composite/Transfer',
  render: ({ leftTitle, rightTitle, value }) =>
    withLog(
      `<fb-transfer ${attrs({ 'left-title': leftTitle, 'right-title': rightTitle })}>${json({ items: ITEMS, value })}</fb-transfer>`,
      'transfer-change',
      (e) => JSON.stringify(e.detail.value),
    ),
  argTypes: {
    leftTitle: prop('左欄標題', { name: 'left-title', type: 'string', def: "'未管轄組織'" }),
    rightTitle: prop('右欄標題', { name: 'right-title', type: 'string', def: "'管轄組織'" }),
    items: prop('全部項目，以內嵌 JSON 提供', { type: '[{ id, label }]', def: '[]', control: false }),
    value: prop('右欄（已選）的 id 陣列', { category: '狀態', type: 'string[]', def: '[]', control: 'object' }),
    mSet: method('setData()', '重設項目與已選值', '(items, value) => void'),
    onChange: event('transfer-change', '項目移動後觸發', '{ value }'),
  },
  args: { leftTitle: '未管轄組織 Unjurisdictional Org.', rightTitle: '管轄組織 Jurisdictional Org.', value: ['n2', 'b1'] },
  parameters: {
    docs: { description: { component: '`<fb-transfer>` 雙欄穿梭清單：搜尋、多選、單項／全部移動。事件：`transfer-change { value }`。' } },
  },
};

export const Playground = {};

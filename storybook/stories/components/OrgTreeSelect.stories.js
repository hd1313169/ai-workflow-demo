import { json, prop, event, method, withLog } from './_util.js';

const TREE = [
  {
    key: 'north', zh: '北區業務部',
    children: [{ key: 'n1', zh: '北區一科' }, { key: 'n2', zh: '北區二科' }, { key: 'n3', zh: '北區三科' }],
  },
  {
    key: 'south', zh: '南區業務部',
    children: [{ key: 's1', zh: '南區一科' }, { key: 's2', zh: '南區二科' }],
  },
  { key: 'it', zh: '資訊處', children: [{ key: 'it1', zh: '系統開發組' }, { key: 'it2', zh: '基礎架構組' }] },
];

export default {
  title: 'Components/Forms/OrgTreeSelect',
  render: ({ placeholder, value }) =>
    withLog(
      `<div style="max-width: 360px; min-height: 460px"><fb-org-tree-select placeholder="${placeholder}">${json({ tree: TREE, value })}</fb-org-tree-select></div>`,
      'change',
    ),
  argTypes: {
    placeholder: prop('未選取時的提示文字', { type: 'string', def: "'請選擇 (可多選)'" }),
    tree: prop('組織樹，以內嵌 JSON 提供', { type: '[{ key, zh, children: [{ key, zh }] }]', def: '[]', control: false }),
    value: prop('已選的 key；某節點底下全選時只存父節點 key', { category: '狀態', type: 'string[]', def: '[]', control: 'object' }),
    mGet: method('getSelection()', '取得目前選取', '() => string[]'),
    mSet: method('setSelection()', '設定選取', '(keys) => void'),
    onChange: event('change', '選取變更時觸發', '{ value }'),
  },
  args: { placeholder: '請選擇 (可多選)', value: ['north', 's1'] },
  parameters: {
    docs: {
      description: {
        component: '`<fb-org-tree-select>` 組織樹狀複選下拉：搜尋、全選、只看已選、展開收合，父子節點連動（含半選狀態）。',
      },
    },
  },
};

export const Playground = {};

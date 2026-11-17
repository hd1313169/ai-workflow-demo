import { prop, event, method } from './_util.js';

export default {
  title: 'Components/Composite/PermTree',
  argTypes: {
    config: prop('欄位與模組，以內嵌 JSON 提供；未提供時使用內建 5 個主模組', {
      type: '{ columns, modules }', def: '內建模組', control: false,
    }),
    mAll: method('selectAll()', '全選', '() => void'),
    mClear: method('clearAll()', '全部取消', '() => void'),
    mGet: method('getSelection()', '取得目前勾選', '() => selection'),
    mSet: method('setSelection()', '套用勾選（例如權限複製模板）', '(selection) => void'),
    onChange: event('perm-change', '勾選變更時觸發', '{ checked, total, exportChecked }'),
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<fb-perm-tree>` 權限樹表：主模組 × 功能頁面 × 權限欄（檢視、新增/編輯、刪除、匯出），父列勾選連動子列，並統計已勾選數與匯出特權數。',
      },
    },
  },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="sb-row" style="margin-bottom: 12px">
        <button class="btn-outline" data-all>全選 selectAll()</button>
        <button class="btn-neutral-outline" data-clear>清除 clearAll()</button>
        <button class="btn-outline" data-set>套用範例 setSelection()</button>
      </div>
      <fb-perm-tree></fb-perm-tree>
      <p class="sb-note" data-log>（perm-change 結果顯示於此）</p>`;
    const tree = el.querySelector('fb-perm-tree');
    const log = el.querySelector('[data-log]');
    el.querySelector('[data-all]').addEventListener('click', () => tree.selectAll());
    el.querySelector('[data-clear]').addEventListener('click', () => tree.clearAll());
    el.querySelector('[data-set]').addEventListener('click', () =>
      tree.setSelection({ home: 'all', marketing: ['客戶訪談與服務紀錄'], report: { '報表中心業績與佔比': ['read', 'export'] } }),
    );
    tree.addEventListener('perm-change', (e) => {
      log.textContent = `perm-change: 已勾選 ${e.detail.checked} / ${e.detail.total}，匯出特權 ${e.detail.exportChecked}`;
    });
    return el;
  },
};

export const Default = {};

import { json } from '../components/_util.js';
import { patternDoc, patternHeader } from './_doc.js';

const META = {
  purpose: '設定管轄範圍：在對話框中以雙欄穿梭清單挑選組織，footer 即時顯示已選數量。',
  parts: ['fb-modal', 'fb-transfer', 'fb-toast'],
  usedIn: ['組織管理'],
};

const ITEMS = [
  { id: 'n1', label: 'N01 北區分部' },
  { id: 'n2', label: 'N02 中區分部' },
  { id: 'n3', label: 'N03 南區分部' },
  { id: 'b1', label: 'B01 東區分公司' },
  { id: 'b2', label: 'B02 西區分公司' },
  { id: 'b3', label: 'B03 離島分公司' },
];

export default {
  title: 'Patterns/管轄範圍設定',
  tags: ['!autodocs'],
  parameters: { options: { showPanel: false }, docs: { description: { component: patternDoc(META) } } },
};

export const Scope = {
  name: '管轄範圍設定',
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `${patternHeader(META)}
      <button class="btn-outline" data-open>設定管轄組織</button>
      <fb-modal heading="設定管轄組織" heading-en="Jurisdiction">
        <fb-transfer left-title="未管轄組織" right-title="管轄組織">${json({ items: ITEMS, value: ['n2'] })}</fb-transfer>
        <div data-modal-footer style="display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%">
          <span class="sb-note" style="margin:0" data-count>已選 1 個組織</span>
          <span style="display:inline-flex;gap:8px">
            <button class="btn-neutral-outline" data-modal-cancel>取消 Cancel</button>
            <button class="btn-primary" data-save>儲存 Save</button>
          </span>
        </div>
      </fb-modal>
      <fb-toast></fb-toast>`;
    const modal = el.querySelector('fb-modal');
    const toast = el.querySelector('fb-toast');
    const count = el.querySelector('[data-count]');
    el.querySelector('[data-open]').addEventListener('click', () => modal.open());
    el.addEventListener('transfer-change', (e) => (count.textContent = `已選 ${e.detail.value.length} 個組織`));
    el.querySelector('[data-save]').addEventListener('click', () => {
      modal.close();
      toast.show('管轄組織已更新');
    });
    return el;
  },
};

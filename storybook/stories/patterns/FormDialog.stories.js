import { json } from '../components/_util.js';
import { patternDoc, patternHeader } from './_doc.js';

const META = {
  purpose: '新增／編輯資料的對話框。上方為基本欄位，中段為啟用開關，下方為權限設定；footer 固定顯示勾選數與動作鈕，儲存後以 toast 回饋。',
  parts: ['fb-modal', '.field', '.text-input', 'fb-toggle', 'fb-dropdown', 'fb-perm-tree', 'fb-toast'],
  usedIn: ['角色管理', '使用者管理', '組織管理', '選單管理', '代理人設定'],
};

export default {
  title: 'Patterns/表單對話框',
  tags: ['!autodocs'],
  parameters: { options: { showPanel: false }, docs: { description: { component: patternDoc(META) } } },
};

export const RoleForm = {
  name: '表單對話框',
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `${patternHeader(META)}
      <button class="btn-primary" data-open><fb-icon name="fb-plus"></fb-icon> 新增角色 Add</button>
      <fb-modal heading="新增角色" heading-en="Add New Role">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="field"><label>角色名稱 <span class="en">Role Name</span></label>
            <input class="text-input" placeholder="請輸入角色名稱" value="區域業務主管"></div>
          <fb-toggle variant="card" checked zh="啟用此角色" en="Active Status"
            desc="停用後已指派此角色的使用者將暫時無法使用相關功能"></fb-toggle>
          <div class="field"><label>權限複製模板 <span class="en">Template</span></label>
            <fb-dropdown type="single">${json({ options: ['不複製', '系統管理員', '主管', '業務員'], value: '不複製' })}</fb-dropdown></div>
          <div class="field"><label>功能權限 <span class="en">Permissions</span></label>
            <fb-perm-tree></fb-perm-tree></div>
        </div>
        <div data-modal-footer style="display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%">
          <span class="sb-note" style="margin:0" data-count></span>
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
    el.addEventListener('perm-change', (e) => {
      count.textContent = `已勾選 ${e.detail.checked} / ${e.detail.total}`;
    });
    el.querySelector('[data-save]').addEventListener('click', () => {
      modal.close();
      toast.show('角色已儲存');
    });
    return el;
  },
};

import { json } from '../components/_util.js';
import { patternDoc, patternHeader } from './_doc.js';

const META = {
  purpose: '清單與報表頁上方的查詢條件區。欄位以三欄網格排列，右下為重置／查詢動作。',
  parts: ['fb-filter-card', 'fb-dropdown', 'fb-date-field', '.btn-primary', 'fb-toast'],
  usedIn: ['境內／境外客戶報表', '使用者管理', '角色管理', '組織管理', '選單管理', '代理人設定', '登入紀錄', '軌跡查詢'],
};

export default {
  title: 'Patterns/篩選區',
  tags: ['!autodocs'],
  parameters: { options: { showPanel: false }, docs: { description: { component: patternDoc(META) } } },
};

export const ReportFilter = {
  name: '篩選區',
  render: () => {
    const el = document.createElement('div');
    el.style.minHeight = '480px';
    el.innerHTML = `${patternHeader(META)}
      <fb-filter-card>
        <div class="filter__grid cols-3">
          <div class="field"><label>單位 <span class="en">Unit</span></label>
            <fb-dropdown type="multi">${json({ options: ['境內', '境外'] })}</fb-dropdown></div>
          <div class="field"><label>產業類別 <span class="en">Sector</span></label>
            <fb-dropdown type="multi" search>${json({ options: ['科技業', '製造業', '金融業', '物流業', '零售業'] })}</fb-dropdown></div>
          <div class="field"><label>指標 <span class="en">KPI</span></label>
            <fb-dropdown type="single">${json({ options: ['淨收益', '銷售量', '佔比'], value: '淨收益' })}</fb-dropdown></div>
          <div class="field"><label>起日 <span class="en">Start</span></label>
            <fb-date-field value="2026/01/01"></fb-date-field></div>
          <div class="field"><label>訖日 <span class="en">End</span></label>
            <fb-date-field value="2026/08/31"></fb-date-field></div>
        </div>
        <div class="sb-row" style="justify-content:flex-end; margin-top:16px">
          <button class="btn-neutral-outline" data-reset>重置 Reset</button>
          <button class="btn-primary" data-query>查詢 Search</button>
        </div>
      </fb-filter-card>
      <fb-toast></fb-toast>`;
    const toast = el.querySelector('fb-toast');
    el.querySelector('[data-query]').addEventListener('click', () => toast.show('已套用篩選條件'));
    el.querySelector('[data-reset]').addEventListener('click', () => toast.show('已重置篩選條件'));
    return el;
  },
};

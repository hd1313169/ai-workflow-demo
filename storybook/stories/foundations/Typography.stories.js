import { byPrefix, resolved } from './tokens.js';

const SAMPLE = '企業客戶報表 Client Report 2026';

export default { title: 'Foundations/Typography', tags: ['!autodocs'], parameters: { options: { showPanel: false } } };

export const Scale = {
  name: '字級與行高',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">字級與行高成對使用：<code>--fs-*</code> 搭配同名 <code>--lh-*</code>。由大到小排列。</p>
    <div class="sb-type">
      ${byPrefix('fs')
        .slice()
        .sort((a, b) => parseFloat(resolved(b.name)) - parseFloat(resolved(a.name)))
        .map((t) => {
          const key = t.name.slice(3);
          return `<div class="sb-type__row">
            <div class="sb-type__meta">
              <strong>${key}</strong>
              <code>${resolved(t.name)} / ${resolved('lh-' + key)}</code>
            </div>
            <div class="sb-type__sample" style="font-size: var(--${t.name}); line-height: var(--lh-${key})">${SAMPLE}</div>
          </div>`;
        })
        .join('')}
    </div>
  </div>`,
};

export const Weight = {
  name: '字重',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">全站只使用兩種字重，以字重而非顏色建立層級。</p>
    <div class="sb-type">
      ${byPrefix('fw')
        .map(
          (t) => `<div class="sb-type__row">
            <div class="sb-type__meta"><strong>${t.name.slice(3)}</strong><code>${resolved(t.name)}</code></div>
            <div class="sb-type__sample" style="font-weight: var(--${t.name}); font-size: var(--fs-h4)">${SAMPLE}</div>
          </div>`,
        )
        .join('')}
    </div>
  </div>`,
};

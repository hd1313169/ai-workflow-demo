import { byPrefix, resolved, px } from './tokens.js';

/** 依實際數值由小到大 */
const sorted = (list) => list.slice().sort((a, b) => px(resolved(a.name)) - px(resolved(b.name)));

export default { title: 'Foundations/Spacing', tags: ['!autodocs'], parameters: { options: { showPanel: false } } };

export const Space = {
  name: '間距',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">間距以 4 的倍數為主。長條為實際尺寸的 8 倍，方便比較彼此的比例。</p>
    <div class="sb-scale">
      ${sorted(byPrefix('pad', 'gap'))
        .map((t) => {
          const v = resolved(t.name);
          return `<div class="sb-scale__row">
            <strong>${t.name}</strong>
            <code>${v}</code>
            <span class="sb-scale__track"><span class="sb-scale__bar" style="width: calc(var(--${t.name}) * 8)"></span></span>
          </div>`;
        })
        .join('')}
    </div>
  </div>`,
};

export const Radius = {
  name: '圓角',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">圓角由小到大：小元件（標籤、核取方塊）用小圓角，卡片與對話框用大圓角。</p>
    <div class="sb-radius-grid">
      ${sorted(byPrefix('radius'))
        .map(
          (t) => `<figure class="sb-radius">
            <span class="sb-radius__tile" style="border-radius: var(--${t.name})"></span>
            <figcaption><strong>${t.name.replace('radius-', '')}</strong><code>${resolved(t.name)}</code></figcaption>
          </figure>`,
        )
        .join('')}
    </div>
  </div>`,
};

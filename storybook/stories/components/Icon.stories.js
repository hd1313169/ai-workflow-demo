import { prop } from './_util.js';

/** 圖示清單即時讀自 icons.js 的 registry，不手抄 */
const names = () => Object.keys((window.FbIcon && window.FbIcon.ICONS) || {}).sort();

export default {
  title: 'Components/Data Display/Icon',
  argTypes: {
    name: prop('圖示名稱（icons registry）', { type: 'string', def: '—', control: 'text' }),
    size: prop('尺寸跟隨 font-size；顏色跟隨 currentColor', { category: '狀態', type: 'CSS length', def: '1em', control: 'text' }),
  },
  args: { name: 'fb-calendar', size: '32px' },
  parameters: {
    docs: {
      description: {
        component: '`<fb-icon name="…">` 內嵌 SVG 圖示：未指定尺寸時為 1em、顏色繼承 currentColor，可直接放在按鈕或文字中。',
      },
    },
  },
  render: ({ name, size }) =>
    `<span style="font-size: ${size}; color: var(--accent-primary)"><fb-icon name="${name}"></fb-icon></span>`,
};

export const Playground = {};

export const Gallery = {
  name: '圖示庫',
  render: () => {
    const list = names();
    return `<p class="sb-note" style="margin: 0 0 16px">共 ${list.length} 個圖示</p>
      <div class="sb-icon-grid">
        ${list
          .map((n) => `<figure class="sb-icon"><fb-icon name="${n}"></fb-icon><figcaption>${n.replace(/^fb-/, '')}</figcaption></figure>`)
          .join('')}
      </div>`;
  },
};

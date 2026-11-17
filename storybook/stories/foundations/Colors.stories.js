import { byPrefix, groupBy, refOf, resolved } from './tokens.js';

const card = (t) => {
  const ref = refOf(t.value);
  const hex = resolved(t.name);
  return `<figure class="sb-color">
    <span class="sb-color__chip" style="background: var(--${t.name})"></span>
    <figcaption>
      <strong>${t.name}</strong>
      <code>${hex}</code>
      ${ref ? `<small>→ ${ref}</small>` : ''}
    </figcaption>
  </figure>`;
};

const section = ([title, list]) => `
  <section class="sb-group">
    <h3>${title}<span>${list.length}</span></h3>
    <div class="sb-color-grid">${list.map(card).join('')}</div>
  </section>`;

/** primitive 依色系分組：color-brand-700 -> blue */
const family = (t) => t.name.replace(/^color-/, '').replace(/-\d+$/, '').replace(/-/g, ' ');

const SEMANTIC = {
  bg: '背景 Background',
  text: '文字 Text',
  accent: '強調 Accent',
  border: '邊框 Border',
  tag: '標籤 Tag',
  status: '狀態框線 Status',
  toast: '通知 Toast',
};

export default {
  title: 'Foundations/Colors',
  tags: ['!autodocs'],
  parameters: {
    options: { showPanel: false },
    docs: {
      description: {
        component: '色票直接讀自 `design/tokens.json`，色塊以 CSS 變數即時渲染；語意色會標示其參照的原始色。',
      },
    },
  },
};

export const Primitive = {
  name: 'Primitive 原始色',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">原始色票只描述「是什麼顏色」。元件不直接使用，而是透過語意色引用；換主題時只改這一層。</p>
    ${groupBy(byPrefix('color'), family).map(section).join('')}
  </div>`,
};

export const Semantic = {
  name: 'Semantic 語意色',
  render: () => `<div class="sb-doc">
    <p class="sb-lead">語意色描述「用在哪裡」，箭頭後為其參照的原始色。</p>
    ${Object.entries(SEMANTIC)
      .map(([prefix, title]) => [title, byPrefix(prefix)])
      .filter(([, list]) => list.length)
      .map(section)
      .join('')}
  </div>`,
};

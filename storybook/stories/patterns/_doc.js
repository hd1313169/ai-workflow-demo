/** Pattern 說明：用途 + 組成元件 + 使用頁面（Docs 與畫布上方都會顯示） */
export const patternDoc = ({ purpose, parts, usedIn }) =>
  `${purpose}\n\n**組成元件**：${parts.map((p) => `\`${p}\``).join('、')}\n\n**使用頁面**：${usedIn.join('、')}`;

/** 畫布上方的說明卡（讓 Canvas 模式也看得到組成與使用頁面） */
export const patternHeader = ({ parts, usedIn }) => `
  <div class="sb-pattern-meta">
    <div><span>組成元件</span>${parts.map((p) => `<code>${p}</code>`).join('')}</div>
    <div><span>使用頁面</span>${usedIn.map((u) => `<em>${u}</em>`).join('')}</div>
  </div>`;

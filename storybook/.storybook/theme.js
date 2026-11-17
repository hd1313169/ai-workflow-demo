import { create } from 'storybook/theming';
import tokens from '../../design/tokens.json';

/** 管理介面主題：主色與字型直接讀 design token，不手抄 */
const t = tokens.tokens;
const primary = t['color-brand-700'].value;

export default create({
  base: 'light',
  brandTitle: 'crm-inst',
  brandUrl: './',
  colorPrimary: primary,
  colorSecondary: primary,
  fontBase: t['font-cn'].value,
});

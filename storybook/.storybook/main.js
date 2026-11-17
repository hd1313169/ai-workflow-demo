/** Storybook 主設定。元件與樣式來自上層專案（../../assets），以 staticDirs 帶進產物，不經 Vite 打包。 */
const config = {
  framework: { name: '@storybook/web-components-vite', options: {} },
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  staticDirs: [
    // 正式頁面原樣放在 app/ 下，保留 index.html <-> pages/*.html <-> assets/ 的相對路徑
    { from: '../../assets', to: '/app/assets' },
    { from: '../../pages', to: '/app/pages' },
    { from: '../../index.html', to: '/app/index.html' },
  ],
  core: { disableTelemetry: true },
  // 關閉側欄「Get started」新手引導清單（僅開發模式顯示）
  features: { sidebarOnboardingChecklist: false },
  docs: { defaultName: 'Docs' },
};
export default config;

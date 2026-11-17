/** 全域預覽設定。元件由 preview-head.html 以傳統 script 載入。 */

/** 每個 story 外包一層舞台：提供頁面底色，並讓浮層類元件（modal、toast）有固定容器 */
const withStage = (story) => {
  const stage = document.createElement('div');
  stage.className = 'sb-stage';
  const out = story();
  if (typeof out === 'string') stage.innerHTML = out;
  else stage.append(out);
  return stage;
};

export default {
  decorators: [withStage],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations', ['Colors', 'Typography', 'Spacing'],
          'Components', ['Atoms', 'Forms', 'Overlays', 'Composite'],
          'Patterns', ['篩選區', '表單對話框', '刪除確認與回饋', '管轄範圍設定'],
          'Pages', ['首頁', '報表', '權限管理', '稽核'],
        ],
      },
    },
  },
  tags: ['autodocs'],
};

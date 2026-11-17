import { attrs, prop, event } from './_util.js';

export default {
  title: 'Components/Atoms/StatusPill',
  render: ({ state, icon, text }) => `<fb-status-pill ${attrs({ state, icon })}>${text}</fb-status-pill>`,
  argTypes: {
    text: prop('膠囊文字（元素內文）', { type: 'string', def: '—' }),
    icon: prop('前置圖示，icons registry 名稱', {
      type: 'string', def: "'fb-link'", control: 'select', options: ['', 'fb-outlook', 'fb-link'],
    }),
    state: prop('on＝已啟用（主色）、off＝未啟用（灰）', {
      category: '狀態', type: "'on' | 'off'", def: "'off'", control: 'inline-radio', options: ['off', 'on'],
    }),
    onPillClick: event('pill-click', '加上 interactive 屬性時，點擊觸發', '{ state }'),
  },
  args: { state: 'on', icon: '', text: '已啟用' },
  parameters: {
    docs: { description: { component: '`<fb-status-pill>` 狀態膠囊。加上 `interactive` 可點擊並派送 `pill-click`。' } },
  },
};

export const Playground = {};

export const Interactive = {
  name: '可點擊切換',
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `<fb-status-pill state="off" icon="fb-outlook" interactive label-off="未啟用" label-on="已啟用">未啟用</fb-status-pill>
      <p class="sb-note">點擊膠囊切換狀態</p>`;
    const pill = el.querySelector('fb-status-pill');
    pill.addEventListener('pill-click', () =>
      pill.setAttribute('state', pill.getAttribute('state') === 'on' ? 'off' : 'on'),
    );
    return el;
  },
};

import { frame } from './_frame.js';

export default {
  title: 'Pages/權限管理',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
};

export const Roles = {
  name: '角色管理',
  render: frame('pages/role_management.html'),
  parameters: { docs: { description: { story: '角色清單 + 新增／編輯對話框（權限樹）。' } } },
};

export const Users = {
  name: '使用者管理',
  render: frame('pages/user_management.html'),
  parameters: { docs: { description: { story: '使用者清單 + 編輯對話框（組織範圍、角色）。' } } },
};

export const Organizations = {
  name: '組織管理',
  render: frame('pages/organization_management.html'),
  parameters: { docs: { description: { story: '組織清單 + 管轄範圍設定（穿梭清單）。' } } },
};

export const Menus = {
  name: '選單管理',
  render: frame('pages/menu_management.html'),
};

export const Agents = {
  name: '代理人設定',
  render: frame('pages/agent_settings.html'),
};

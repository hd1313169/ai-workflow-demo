import { frame } from './_frame.js';

export default {
  title: 'Pages/稽核',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
};

export const LoginLogs = {
  name: '使用者登入紀錄',
  render: frame('pages/user_login_logs.html'),
};

export const ActivityLogs = {
  name: '使用者軌跡查詢',
  render: frame('pages/user_activity_logs.html'),
};

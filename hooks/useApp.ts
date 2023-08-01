import { App } from 'antd';

export default function useApp() {
  const { notification, message, modal } = App.useApp();
  return { notification, message, modal };
}

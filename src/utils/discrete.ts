import { isDark } from '@/composables/dark';
import { createDiscreteApi, darkTheme, lightTheme, type ConfigProviderProps } from 'naive-ui';

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: isDark.value ? lightTheme : darkTheme
}));

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    configProviderProps: configProviderPropsRef
  }
);

export const useDiscrete = () => {
  return {
    message,
    notification,
    dialog,
    loadingBar
  };
};

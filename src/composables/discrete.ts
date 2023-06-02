import { isDark } from '@/composables';
import { createDiscreteApi, darkTheme, lightTheme, type ConfigProviderProps } from 'naive-ui';

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: isDark.value ? darkTheme : lightTheme
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

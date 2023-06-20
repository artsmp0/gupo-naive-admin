import { defineStore } from 'pinia';
import setting from '@/config.json';

type SettingKey = keyof typeof setting;
export const useSettingStore = defineStore('setting', () => {
  const defaultSetting = ref(setting);

  const settingMap = ref<
    { key: SettingKey; label: string; type: 'switch' | 'select' | 'inputNumber' | 'input' }[]
  >([
    {
      key: 'SHOW_AVATAR',
      label: '头像',
      type: 'switch'
    },
    {
      key: 'SHOW_BREADCRUMB',
      type: 'switch',
      label: '面包屑'
    },
    {
      key: 'SHOW_FULLSCREEN_BTN',
      type: 'switch',
      label: '全屏按钮'
    },
    {
      key: 'SHOW_REFRESH_BTN',
      type: 'switch',
      label: '刷新按钮'
    },
    {
      key: 'SHOW_THEME_BTN',
      type: 'switch',
      label: '主题按钮'
    },
    {
      key: 'SHOW_TABS',
      type: 'switch',
      label: '标签栏'
    },
    {
      key: 'SIDE_WIDTH',
      type: 'inputNumber',
      label: '边栏宽度'
    },
    {
      key: 'PAGE_ANIMATION',
      label: '过渡动画',
      type: 'select'
    },
    {
      key: 'APP_NAME',
      label: '系统名称',
      type: 'input'
    }
  ]);

  return {
    defaultSetting,
    settingMap
  };
});

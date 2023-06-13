<script setup lang="ts">
import { zhCN, dateZhCN, NThemeEditor, darkTheme } from 'naive-ui';
import { LIGHT_THEME_OVERRIDES, DARK_THEME_OVERRIDES } from './constants';
import { isDark } from './composables';

const isDev = computed(() => import.meta.env.DEV);

const currentTheme = computed(() => {
  return isDark.value ? darkTheme : null;
});

const themeOverrides = computed(() => {
  return isDark.value ? DARK_THEME_OVERRIDES : LIGHT_THEME_OVERRIDES;
});
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="currentTheme"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <NEl class="h-full w-full">
      <NThemeEditor v-if="isDev">
        <RouterView />
      </NThemeEditor>
      <RouterView v-else />
    </NEl>
  </NConfigProvider>
</template>

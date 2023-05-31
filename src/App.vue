<script setup lang="ts">
import { zhCN, dateZhCN, NThemeEditor, darkTheme } from 'naive-ui';
import { THEME_OVERRIDES } from './constants';
import { isDark } from './composables';

const isDev = computed(() => import.meta.env.DEV);

const currentTheme = computed(() => {
  return isDark.value ? darkTheme : null;
});
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="currentTheme"
    :date-locale="dateZhCN"
    :theme-overrides="THEME_OVERRIDES"
  >
    <RouterView />
    <NThemeEditor v-if="isDev"> </NThemeEditor>
    <NGlobalStyle />
  </NConfigProvider>
</template>

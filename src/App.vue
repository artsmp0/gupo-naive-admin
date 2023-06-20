<script setup lang="ts">
import { zhCN, dateZhCN, NThemeEditor } from 'naive-ui';
import { LIGHT_THEME_OVERRIDES } from './constants';

const isDev = computed(() => import.meta.env.DEV);
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="LIGHT_THEME_OVERRIDES">
    <NEl class="h-full w-full">
      <NThemeEditor v-if="isDev">
        <RouterView />
      </NThemeEditor>
      <RouterView v-else />
    </NEl>
  </NConfigProvider>
</template>

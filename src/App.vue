<script setup lang="ts">
import { RouterView } from 'vue-router';
import { zhCN, dateZhCN, NThemeEditor } from 'naive-ui';
import { computed } from 'vue';

const isDev = computed(() => import.meta.env.DEV);
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <NEl class="nel">
      <RouterView />
    </NEl>
    <NThemeEditor v-if="isDev" />
  </NConfigProvider>
</template>

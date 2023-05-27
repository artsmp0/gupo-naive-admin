<script setup lang="ts">
import { RouterView } from 'vue-router';
import { zhCN, dateZhCN, NThemeEditor } from 'naive-ui';
import { computed } from 'vue';
import { themeOverrides } from '@/constants';

const isDev = computed(() => import.meta.env.DEV);
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <!-- 打包的时候如果为了更好的加载性能，可以删掉这个判断（他会增加150kb的打包体积），因为主题组件在线上其实不暴露出来给用户调整的 -->
    <!-- 而且主题调整完后是需要复制到 constants/theme 中进行覆盖的 -->
    <NThemeEditor v-if="isDev">
      <NEl class="nel">
        <RouterView />
      </NEl>
    </NThemeEditor>
    <NEl class="nel" v-else>
      <RouterView />
    </NEl>
  </NConfigProvider>
</template>

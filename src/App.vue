<script setup lang="ts">
import { zhCN, dateZhCN, NThemeEditor, darkTheme } from 'naive-ui';
import { themeOverrides } from './constants';
import { isDark } from './composables/dark';

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
    :theme-overrides="themeOverrides"
  >
    <!-- 打包的时候如果为了更好的加载性能，可以删掉这个判断（他会增加150kb的打包体积），因为主题组件在线上其实不暴露出来给用户调整的 -->
    <!-- 而且主题调整完后是需要复制到 constants/theme 中进行覆盖的 -->
    <NThemeEditor v-if="isDev">
      <NEl class="nel">
        <RouterView />
      </NEl>
    </NThemeEditor>
    <!-- NEl 组件 是为了让 css 变量可以被 unocss 访问或者 普通css 访问 -->
    <NEl v-else class="nel">
      <RouterView />
    </NEl>
  </NConfigProvider>
</template>

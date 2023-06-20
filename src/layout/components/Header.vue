<script setup lang="ts">
import {
  MoonOutline,
  SunnyOutline,
  LogOutOutline,
  CreateOutline,
  SettingsOutline
} from '@vicons/ionicons5';
import { CompressOutlined, ExpandOutlined, ReloadOutlined } from '@vicons/antd';
import { isDark } from '@/composables';
import { useFullscreen } from '@vueuse/core';
import { NAvatar, NIcon, NText } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import Breadcrumbs from './Breadcrumbs.vue';
import { useDiscrete } from '@/composables';
import { isDdOrZzd } from '@/utils';
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import Settings from './Settings.vue';
import { useSettingStore } from '@/stores/setting';

const { toggle, isFullscreen } = useFullscreen(document.body);

const router = useRouter();

const reload = () => {
  router.replace('/redirect' + router.currentRoute.value.fullPath);
};
const { dialog } = useDiscrete();
const logout = () => {
  dialog.warning({
    title: '退出系统',
    content: '你确定退出登录？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      userStore.logout();
    }
  });
};

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;'
    },
    [
      h(
        NAvatar,
        {
          round: true,
          style: 'margin-right: 12px;'
        },
        { default: () => 'A' }
      ),
      h('div', null, [
        h('div', null, [
          h(NText, { depth: 2 }, { default: () => userStore.userInfo?.name || '打工仔' })
        ]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3 },
            { default: () => userStore.userInfo?.phone || '毫无疑问，你是办公室里最亮的星' }
          )
        ])
      ])
    ]
  );
}

const userOptions: DropdownMixedOption[] = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader
  },
  {
    label: '编辑信息',
    key: 'edit',
    icon: renderIcon(CreateOutline)
  }
];

if (!isDdOrZzd()) {
  userOptions.push({
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  });
}

const userStore = useUserStore();
const onSelect = (key: string) => {
  if (key === 'logout') {
    logout();
  }
};

function toggleDark(event: MouseEvent) {
  const isAppearanceTransition =
    // @ts-ignore
    document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });
}

// 设置
const showSettings = ref<boolean>(false);
const settingStore = useSettingStore();
const SHOW_REFRESH_BTN = computed(() => settingStore.defaultSetting.SHOW_REFRESH_BTN);
const SHOW_THEME_BTN = computed(() => settingStore.defaultSetting.SHOW_THEME_BTN);
const SHOW_AVATAR = computed(() => settingStore.defaultSetting.SHOW_AVATAR);
const SHOW_BREADCRUMB = computed(() => settingStore.defaultSetting.SHOW_BREADCRUMB);
const SHOW_FULLSCREEN_BTN = computed(() => settingStore.defaultSetting.SHOW_FULLSCREEN_BTN);
const APP_NAME = computed(() => settingStore.defaultSetting.APP_NAME);
</script>

<template>
  <NLayoutHeader class="h60 px20" flex="~ items-center justify-between" bordered>
    <div class="h40" flex="~ justify-center items-center">
      <img src="@/assets/imgs/logo.png" alt="LOGO" class="mr16 h-full" />
      <NTag mr16 :bordered="false" :color="{ textColor: 'var(--primary-color)' }" size="small">{{
        APP_NAME
      }}</NTag>
      <Breadcrumbs v-if="SHOW_BREADCRUMB" />
    </div>
    <div class="shrink-0" flex="~ items-center gap-16">
      <NButton v-if="SHOW_REFRESH_BTN" secondary circle @click="reload">
        <template #icon>
          <NIcon><ReloadOutlined /></NIcon>
        </template>
      </NButton>
      <NButton v-if="SHOW_FULLSCREEN_BTN" circle secondary @click="toggle">
        <template #icon>
          <NIcon>
            <CompressOutlined v-if="isFullscreen" />
            <ExpandOutlined v-else />
          </NIcon>
        </template>
      </NButton>
      <NButton v-if="SHOW_THEME_BTN" circle secondary @click="toggleDark">
        <template #icon>
          <NIcon>
            <MoonOutline v-if="isDark" />
            <SunnyOutline v-else />
          </NIcon>
        </template>
      </NButton>
      <NButton circle secondary @click="showSettings = true">
        <template #icon>
          <NIcon>
            <SettingsOutline />
          </NIcon>
        </template>
      </NButton>
      <NDropdown v-if="SHOW_AVATAR" :options="userOptions" @select="onSelect">
        <NAvatar round> A </NAvatar>
      </NDropdown>
    </div>
    <Settings v-model:show="showSettings" />
  </NLayoutHeader>
</template>

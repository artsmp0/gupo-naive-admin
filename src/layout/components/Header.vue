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

const { toggle, isFullscreen } = useFullscreen(document.body);

const reload = () => {
  location.reload();
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

const appName = computed(() => import.meta.env.VITE_APP_TITLE);

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
        duration: 500,
        easing: 'ease-out',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });
}
</script>

<template>
  <NLayoutHeader class="h60 px20" flex="~ items-center justify-between" bordered>
    <div class="h40" flex="~ justify-center items-center">
      <img src="@/assets/imgs/logo.png" alt="LOGO" class="mr16 h-full" />
      <NTag mr16 :bordered="false" type="error" size="small">{{ appName }}</NTag>
      <Breadcrumbs />
    </div>
    <div class="shrink-0" flex="~ items-center gap-16">
      <NButton secondary circle @click="reload">
        <template #icon>
          <NIcon><ReloadOutlined /></NIcon>
        </template>
      </NButton>
      <NButton circle secondary @click="toggle">
        <template #icon>
          <NIcon>
            <CompressOutlined v-if="isFullscreen" />
            <ExpandOutlined v-else />
          </NIcon>
        </template>
      </NButton>
      <NButton circle secondary @click="toggleDark">
        <template #icon>
          <NIcon>
            <MoonOutline v-if="isDark" />
            <SunnyOutline v-else />
          </NIcon>
        </template>
      </NButton>
      <NButton circle secondary>
        <template #icon>
          <NIcon>
            <SettingsOutline />
          </NIcon>
        </template>
      </NButton>
      <NDropdown :options="userOptions" @select="onSelect">
        <NAvatar round> A </NAvatar>
      </NDropdown>
    </div>
  </NLayoutHeader>
</template>

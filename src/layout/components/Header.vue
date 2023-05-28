<script setup lang="ts">
import {
  MoonOutline,
  SunnyOutline,
  LogOutOutline,
  Expand,
  ReloadOutline,
  Contract
} from '@vicons/ionicons5';
import { isDark, toggleDark } from '@/composables/dark';
import { useFullscreen } from '@vueuse/core';
import { NAvatar, NIcon, NText } from 'naive-ui';
import { useUserStore } from '@/stores/user';

const { toggle, isFullscreen } = useFullscreen(document.body);

const reload = () => {
  location.reload();
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
        h('div', null, [h(NText, { depth: 2 }, { default: () => '打工仔' })]),
        h('div', { style: 'font-size: 12px;' }, [
          h(NText, { depth: 3 }, { default: () => '毫无疑问，你是办公室里最亮的星' })
        ])
      ])
    ]
  );
}

const userOptions = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
];

const userStore = useUserStore();
const onSelect = (key: string) => {
  if (key === 'logout') {
    userStore.logout();
  }
};
</script>

<template>
  <NLayoutHeader class="h60 flex items-center justify-between px20" bordered>
    <div class="h40" flex="~ justify-center items-center">
      <img src="@/assets/imgs/logo.png" alt="LOGO" class="mr8 h-full" />
      <NTag :bordered="false" type="error" size="small">告白气球</NTag>
    </div>
    <NSpace>
      <NButton circle @click="reload">
        <template #icon>
          <NIcon><ReloadOutline /></NIcon>
        </template>
      </NButton>
      <NButton circle @click="toggle">
        <template #icon>
          <NIcon>
            <Contract v-if="isFullscreen" />
            <Expand v-else />
          </NIcon>
        </template>
      </NButton>
      <NButton circle @click="toggleDark()">
        <template #icon>
          <NIcon>
            <MoonOutline v-if="isDark" />
            <SunnyOutline v-else />
          </NIcon>
        </template>
      </NButton>
      <NDropdown :options="userOptions" @select="onSelect">
        <NAvatar round> A </NAvatar>
      </NDropdown>
    </NSpace>
  </NLayoutHeader>
</template>

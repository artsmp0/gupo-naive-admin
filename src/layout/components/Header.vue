<script setup lang="ts">
import {
  MoonOutline,
  SunnyOutline,
  LogOutOutline,
  CreateOutline,
  SettingsOutline
} from '@vicons/ionicons5';
import { BarsOutlined, CompressOutlined, ExpandOutlined, ReloadOutlined } from '@vicons/antd';
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

// 设置
const showSettings = ref<boolean>(false);
const settingStore = useSettingStore();
const SHOW_AVATAR = computed(() => settingStore.defaultSetting.SHOW_AVATAR);
const APP_NAME = computed(() => settingStore.defaultSetting.APP_NAME);
</script>

<template>
  <NLayoutHeader class="h54 bg-primary px20 text-white" flex="~ items-center " bordered>
    <div class="w176 text-20 font-semibold">
      {{ APP_NAME }}
    </div>
    <div class="divider"></div>
    <div ml24>
      <div class="gupo-button" @click="settingStore.toggleCollapsed">
        <NIcon size="22"><BarsOutlined /></NIcon>
      </div>
    </div>
    <div class="ml-auto shrink-0" flex="~ items-center gap-16">
      <div>{{ userStore.userInfo?.name || '打工仔' }}</div>
      <NDropdown v-if="SHOW_AVATAR" :options="userOptions" @select="onSelect">
        <NAvatar round> A </NAvatar>
      </NDropdown>
    </div>
    <Settings v-model:show="showSettings" />
  </NLayoutHeader>
</template>

<style lang="scss" scoped>
.divider {
  width: 1px;
  height: 70%;
  background: linear-gradient(0deg, var(--primary-color), #fff, var(--primary-color));
}

.gupo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  background: rgb(255 255 255 / 30%);
  border-radius: 4px;
}
</style>

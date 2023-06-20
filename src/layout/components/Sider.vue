<script setup lang="tsx">
import { NEllipsis, type MenuOption } from 'naive-ui';
import { usePermissionStore, type MenuItemType } from '@/stores/permission';
import type { RouteMeta } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';
import { RouterLink } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import { useSettingStore } from '@/stores/setting';

type GupoMenuOption = MenuOption & {
  name: string;
  meta: RouteMeta;
};

const permissionStore = usePermissionStore();

const resolveMenu = (menus: MenuItemType[]) => {
  const list: MenuOption[] = [];
  menus.forEach((m) => {
    if (m.meta?.hideInMenu) return;
    const children = resolveMenu(m.children);
    list.push({
      label: m.meta?.title,
      key: m.path,
      name: m.name,
      meta: m.meta,
      children: children.length > 0 ? children : undefined
    });
  });
  return list;
};

const menuOptions = computed<MenuOption[]>(() => {
  return resolveMenu(permissionStore.menuList);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderIcon: any = (option: GupoMenuOption) => {
  const icon = option.meta?.icon;
  if (!icon) return null;
  return <SvgIcon name={icon} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLabel: any = (option: GupoMenuOption) => {
  const el = <NEllipsis tooltip={{ placement: 'right', flip: false }}>{option.label}</NEllipsis>;
  if (!option.children || option.meta.isPage) {
    // 没有 children 说明一定是页面，isPage 标识打上也表示一定是个页面
    return <RouterLink to={{ path: option.key as string }}>{el}</RouterLink>;
  }
  return el;
};

const route = useRoute();
const selectedItem = computed(() => {
  return route.path;
});

const { width } = useWindowSize();
const collapsed = ref(false);
watch(width, (v) => {
  if (v > 768) {
    collapsed.value = false;
  } else {
    collapsed.value = true;
  }
});

const settingStore = useSettingStore();
const SIDE_WIDTH = computed(() => settingStore.defaultSetting.SIDE_WIDTH);
</script>

<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="SIDE_WIDTH"
    :collapsed="collapsed"
    :native-scrollbar="false"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <NMenu
      :value="selectedItem"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :collapsed="collapsed"
      :render-icon="renderIcon"
      :render-label="renderLabel"
    />
  </NLayoutSider>
</template>

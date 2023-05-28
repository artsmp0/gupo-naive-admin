<script setup lang="tsx">
import { type MenuOption } from 'naive-ui';
import { usePermissionStore, type MenuItemType } from '@/stores/permission';
import type { RouteMeta } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';
import { RouterLink } from 'vue-router';

type GupoMenuOption = MenuOption & {
  name: string;
  meta: RouteMeta;
};

const permissionStore = usePermissionStore();

const resolveMenu = (menus: MenuItemType[]) => {
  const list: MenuOption[] = [];
  menus.forEach((m) => {
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
  if (!option.children) {
    return <RouterLink to={{ path: option.key as string }}>{option.label}</RouterLink>;
  }
  return option.label;
};

const collapsed = ref(false);
const route = useRoute();
const selectedItem = computed(() => {
  return route.path;
});
</script>

<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="200"
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

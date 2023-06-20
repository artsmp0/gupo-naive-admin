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
const settingStore = useSettingStore();
// const collapsed = ref(settingStore.collapsed);
// watch(width, (v) => {
//   if (v > 768) {
//     collapsed.value = false;
//   } else {
//     collapsed.value = true;
//   }
// });

const SIDE_WIDTH = computed(() => settingStore.defaultSetting.SIDE_WIDTH);
</script>

<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="SIDE_WIDTH"
    :collapsed="settingStore.collapsed"
    :native-scrollbar="false"
  >
    <NMenu
      :value="selectedItem"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :collapsed="settingStore.collapsed"
      :render-icon="renderIcon"
      :render-label="renderLabel"
    />
  </NLayoutSider>
</template>

<style lang="scss">
.n-menu {
  .n-submenu-children {
    .n-menu-item-content:not(.n-menu-item-content--selected, :hover) {
      &::before {
        background-color: #e8e9ea !important;
      }
    }
  }

  .n-menu-item-content {
    &::before {
      // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    }

    &:not(.n-menu-item-content--selected):hover {
      &::before {
        background-color: #e7f2fb !important;
      }

      .n-menu-item-content-header {
        a {
          color: var(--primary-color) !important;
        }
      }

      .n-menu-item-content__icon {
        color: var(--primary-color) !important;
      }
    }
  }

  .n-menu-item-content--selected {
    &::before {
      background-color: var(--primary-color) !important;
    }

    .n-menu-item-content-header {
      a {
        color: #fff !important;
      }
    }

    .n-menu-item-content__icon {
      color: #fff !important;
    }
  }
}

.n-menu.n-menu--collapsed .n-menu-item-content.n-menu-item-content--selected::before {
  background-color: var(--primary-color) !important;
}
</style>

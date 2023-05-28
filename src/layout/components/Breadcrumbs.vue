<script setup lang="ts">
import { usePermissionStore, type MenuItemType } from '@/stores/permission';
import { storeToRefs } from 'pinia';

const permissionStore = usePermissionStore();
const { flatMenuList } = storeToRefs(permissionStore);

const route = useRoute();
const data = ref<MenuItemType[]>([]);
function findRoutePath(targetPath: string) {
  const res = [] as MenuItemType[];
  const target = flatMenuList.value.find((m) => m.path === targetPath);
  if (target) {
    res.unshift(target);
    if (target.parentPath) {
      res.unshift(...findRoutePath(target.parentPath));
    }
  }
  return res;
}
watch(
  route,
  (v) => {
    data.value = findRoutePath(v.path);
  },
  { immediate: true }
);
</script>

<template>
  <NBreadcrumb v-if="data.length > 0" class="display-none! sm:display-flex!" separator="/">
    <NBreadcrumbItem v-for="item in data" :key="item.path" :clickable="false">{{
      item.meta?.title
    }}</NBreadcrumbItem>
  </NBreadcrumb>
</template>

<style lang="scss" scoped>
.n-breadcrumb {
  display: flex;
  align-items: center;

  :deep(.n-breadcrumb-item) {
    .n-breadcrumb-item__separator {
      margin: 0 2px;
      margin-bottom: 2px;
    }
  }
}
</style>

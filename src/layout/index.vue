<script setup lang="ts">
import Sider from './components/Sider.vue';
import Header from './components/Header.vue';
import { usePermissionStore } from '@/stores/permission';

const permissionStore = usePermissionStore();
const include = computed(() => {
  return Array.from(permissionStore.cachedPages);
});
</script>

<template>
  <div class="relative h-full">
    <NLayout position="absolute">
      <Header />
      <NLayout has-sider position="absolute" style="top: 60px">
        <Sider />
        <NLayoutContent :native-scrollbar="false" embedded content-style="padding: 16px;">
          <RouterView>
            <template #default="{ Component }">
              <Transition mode="out-in" name="fade">
                <KeepAlive :include="include">
                  <Component :is="Component" />
                </KeepAlive>
              </Transition>
            </template>
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

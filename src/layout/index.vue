<script setup lang="ts">
import Sider from './components/Sider.vue';
import Header from './components/Header.vue';
import { usePermissionStore } from '@/stores/permission';
import Tabs from './components/Tabs.vue';
import { useSettingStore } from '@/stores/setting';

const permissionStore = usePermissionStore();
const include = computed(() => {
  return Array.from(permissionStore.cachedPages);
});

const settingStore = useSettingStore();
const SHOW_TABS = computed(() => settingStore.defaultSetting.SHOW_TABS);
</script>

<template>
  <div class="relative h-full">
    <NLayout position="absolute">
      <Header />
      <NLayout has-sider position="absolute" style="top: 60px">
        <Sider />
        <NLayoutContent embedded :content-style="{ height: '100%', overflow: 'hidden' }">
          <div class="h-full flex flex-col">
            <Tabs v-if="SHOW_TABS" />
            <div class="flex-1 of-auto">
              <RouterView>
                <template #default="{ Component }">
                  <Transition mode="out-in" name="fade-up">
                    <KeepAlive :include="include">
                      <Component :is="Component" />
                    </KeepAlive>
                  </Transition>
                </template>
              </RouterView>
            </div>
          </div>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

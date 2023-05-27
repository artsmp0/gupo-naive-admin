<script setup lang="ts">
import { MoonOutline, SunnyOutline, PersonCircleOutline } from '@vicons/ionicons5';
import Sider from './components/Sider.vue';
import { isDark, toggleDark } from '@/composables/dark';
</script>

<template>
  <div class="relative h-full">
    <NLayout position="absolute">
      <NLayoutHeader class="h60 flex items-center justify-between px20" bordered>
        <div>LOGO</div>
        <NSpace>
          <NButton circle @click="toggleDark()">
            <template #icon>
              <NIcon>
                <MoonOutline v-if="isDark" />
                <SunnyOutline v-else />
              </NIcon>
            </template>
          </NButton>
          <NButton circle>
            <template #icon>
              <NIcon><PersonCircleOutline /></NIcon>
            </template>
          </NButton>
        </NSpace>
      </NLayoutHeader>
      <NLayout has-sider position="absolute" style="top: 60px">
        <Sider />
        <NLayoutContent :native-scrollbar="false" embedded content-style="padding: 16px;">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

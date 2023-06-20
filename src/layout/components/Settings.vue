<script setup lang="ts">
import { useSettingStore } from '@/stores/setting';
const show = defineModel<boolean>('show');

const settingStore = useSettingStore();
</script>

<template>
  <!-- @vue-skip -->
  <NDrawer v-model:show="show" :width="300">
    <NDrawerContent title="系统设置">
      <NDivider> 界面显示 </NDivider>
      <div flex="~ col gap-16">
        <div
          v-for="item in settingStore.settingMap"
          :key="item.key"
          flex="~ items-center justify-between"
        >
          <span>{{ item.label }}</span>
          <NSwitch
            v-if="item.type === 'switch'"
            v-model:value="settingStore.defaultSetting[item.key]"
          ></NSwitch>
          <NInputNumber
            v-else-if="item.type === 'inputNumber'"
            v-model:value="settingStore.defaultSetting[item.key] as number"
            :show-button="false"
            style="width: 150px"
          >
            <template #suffix> PX </template>
          </NInputNumber>
          <NSelect
            v-else-if="item.type === 'select'"
            v-model:value="settingStore.defaultSetting[item.key] as string"
            style="width: 150px"
          ></NSelect>
          <NInput
            v-else-if="item.type === 'input'"
            v-model:value="settingStore.defaultSetting[item.key] as string"
            style="width: 150px"
          ></NInput>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  CompressOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  ExpandOutlined,
  ReloadOutlined
} from '@vicons/antd';
import type { RightUtils } from '../table';
import { useFullscreen } from '@vueuse/core';
import type { DataTableProps } from 'naive-ui';

const props = defineProps<{
  options: RightUtils;
  wrapper?: HTMLDivElement;
  reload: (keepPage?: boolean) => void;
}>();

const size = defineModel<DataTableProps['size']>('size');

type Utils = Record<
  RightUtils[number],
  {
    tip: string;
    key: RightUtils[number];
    icon: Component;
  }
>;
const wrapper = toRef(() => props.wrapper);
const { isFullscreen, toggle } = useFullscreen(wrapper);

const UTILS = computed<Utils>(() => ({
  size: {
    tip: '尺寸',
    key: 'size',
    icon: ColumnHeightOutlined
  },
  fullscreen: {
    tip: isFullscreen.value ? '取消全屏' : '全屏',
    key: 'fullscreen',
    icon: isFullscreen.value ? CompressOutlined : ExpandOutlined
  },
  reload: {
    tip: '刷新',
    key: 'reload',
    icon: ReloadOutlined
  },
  setting: {
    tip: '设置',
    key: 'setting',
    icon: SettingOutlined
  }
}));

const data = computed(() => {
  return props.options.map((key) => {
    return UTILS.value[key];
  });
});

const handleClick = (key: RightUtils[number]) => {
  switch (key) {
    case 'fullscreen':
      toggle();
      break;
    case 'reload':
      props.reload();
      break;
  }
};

// "small" | "medium" | "large" | undefined
const sizeOptions = [
  {
    label: '更小',
    value: 'small'
  },
  {
    label: '不大',
    value: 'medium'
  },
  {
    label: '更大',
    value: 'large'
  }
];
</script>

<template>
  <div flex="~ items-center gap-16">
    <HelpMessage v-for="item in data" :key="item.key" :message="item.tip">
      <NPopselect
        v-if="item.key === 'size'"
        v-model:value="size"
        :options="sizeOptions"
        trigger="click"
      >
        <Component :is="item.icon" class="cursor-pointer outline-none" />
      </NPopselect>
      <Component :is="item.icon" v-else class="cursor-pointer" @click="handleClick(item.key)" />
    </HelpMessage>
  </div>
</template>

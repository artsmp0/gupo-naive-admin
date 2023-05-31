<script setup lang="ts">
import { QuestionCircleOutlined } from '@vicons/antd';

const props = withDefaults(
  defineProps<{
    iconSize?: string | number;
    message: string;
    messageFontSize?: string;
  }>(),
  {
    iconSize: 18,
    messageFontSize: '12px'
  }
);
</script>

<template>
  <NTooltip :style="{ fontSize: props.messageFontSize }">
    <template #trigger>
      <NIcon :size="props.iconSize">
        <slot>
          <QuestionCircleOutlined />
        </slot>
      </NIcon>
    </template>
    {{ props.message }}
  </NTooltip>
</template>

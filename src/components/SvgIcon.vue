<script lang="ts" setup>
import type { CSSProperties } from 'vue';

interface Props {
  /** icon 文件夹下的图标名称 */
  name: string;
  /**
   * 图标颜色
   * @default currentColor
   */
  color?: string;
  /**
   * 图标尺寸
   * @default 1em
   */
  size?: string;
  /**
   * 是否旋转
   * @default false
   */
  spin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  color: 'currentColor',
  size: '1em',
  spin: false
});

const symbolId = computed(() => `#icon-${props.name}`);
const getStyle = computed((): CSSProperties => {
  return {
    width: props.size,
    height: props.size
  };
});
</script>

<template>
  <svg aria-hidden="true" :class="spin && 'animate-spin'" class="gupo-icon" :style="getStyle">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="scss" scoped>
.gupo-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>

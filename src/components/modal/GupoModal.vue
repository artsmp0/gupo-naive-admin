<script setup lang="ts">
import type { ModalProps } from 'naive-ui';
import type { ModalMethods } from './types';

const emits = defineEmits(['register', 'close', 'confirm']);

const attrs = useAttrs();
const propsRef = ref<ModalProps | {}>({});
const bindValues = computed(() => {
  return {
    ...attrs,
    ...propsRef.value
  };
});

const show = ref(false);
const open = () => {
  show.value = true;
};

const close = () => {
  show.value = false;
};

const updateProps: ModalMethods['updateProps'] = (newProps) => {
  propsRef.value = Object.assign(propsRef.value, newProps);
};

emits('register', {
  open,
  close,
  updateProps
});
</script>

<template>
  <!-- 注意顺序 -->
  <NModal v-bind="bindValues" v-model:show="show">
    <slot />
  </NModal>
</template>

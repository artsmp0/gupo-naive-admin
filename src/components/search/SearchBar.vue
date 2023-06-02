<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { cloneDeep } from 'lodash';
import { NForm } from 'naive-ui';
import type { CSSProperties } from 'vue';

const props = withDefaults(
  defineProps<{
    labelWidth?: string;
    loading?: boolean;
    minWidth?: string;
  }>(),
  {
    labelWidth: '100px',
    minWidth: '320px'
  }
);

const emits = defineEmits<{
  search: [];
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = defineModel<Record<string, any>>('model');

const defaultHeight = 58;
const emptyBoxCount = ref(1);
const $form = shallowRef<InstanceType<typeof NForm>>();
const isShowToggleBtn = ref(true); // 控制切换按钮显示隐藏
const searchBoxWidth = ref(0); // 控制 searchBar 的宽度：保证能遮挡住一个 form-item
const currentHeight = ref(defaultHeight); // 控制 searchBar 的高度
const controlObserver = ref(false); // 解决组件失活报错的问题
onDeactivated(() => {
  controlObserver.value = true;
});
onActivated(() => {
  controlObserver.value = false;
});
const totalRealCount = ref(0);
onMounted(() => {
  totalRealCount.value = ($form.value!.$el as HTMLDivElement).childElementCount - 1;
  useResizeObserver($form.value?.$el, (entries) => {
    if (controlObserver.value) return;
    const { borderBoxSize, target } = entries[0]!;
    if (!borderBoxSize?.[0]) return;
    // 取整，这个 blockSize 可能为小数
    currentHeight.value = Math.round(borderBoxSize![0].blockSize);

    if (currentHeight.value === defaultHeight) {
      // 如果相等说明只有一行，不需要显示『展开』『收起』按钮
      isShowToggleBtn.value = false;
    } else {
      isShowToggleBtn.value = true;
    }
    // 获取到盒子每一项的宽度，用于操作区域遮挡作用
    searchBoxWidth.value = (target.firstElementChild as HTMLDivElement).offsetWidth;

    const perLineCount = Math.floor(borderBoxSize![0].inlineSize / searchBoxWidth.value);

    const totalCount = unref(totalRealCount);
    if (totalCount % 2 === 0) {
      const count = (totalCount % perLineCount) + 1;

      if (emptyBoxCount.value === count) return;
      emptyBoxCount.value = count || 1;
      return;
    }
    const count = totalCount % perLineCount;

    if (emptyBoxCount.value === count) return;
    emptyBoxCount.value = count || 1;
  });
});
const wrapperStyle = computed<CSSProperties>(() => ({
  overflow: 'hidden',
  padding: '2px',
  transition: '0.3s',
  position: 'relative',
  height: (isOpen.value ? currentHeight.value : defaultHeight) + 'px'
}));
const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let defaultModel = cloneDeep(model.value)!;
const onReset = () => {
  model.value = cloneDeep(defaultModel);
  onSearch();
};

const onSearch = () => {
  emits('search');
};
</script>

<template>
  <NCard :content-style="{ padding: '22px 0 0 16px' }">
    <div :style="wrapperStyle">
      <NForm
        ref="$form"
        class="search-form"
        :model="model"
        label-placement="left"
        inline
        :label-width="props.labelWidth"
      >
        <slot />
        <NFormItem v-for="item in emptyBoxCount" :key="item"> </NFormItem>
        <div
          flex="~ items-start justify-end gap-8 "
          class="absolute bottom-0 right-0 z-10 h58 bg-[--n-color]"
          :style="{ width: searchBoxWidth + 'px', marginRight: '18px' }"
        >
          <NButton secondary type="tertiary" :loading="props.loading" @click="onReset">
            重置
          </NButton>
          <NButton type="primary" :loading="props.loading" @click="onSearch">查询</NButton>
          <NButton v-if="isShowToggleBtn" @click="toggle">
            {{ isOpen ? '收起' : '展开' }}
          </NButton>
        </div>
      </NForm>
    </div>
  </NCard>
</template>

<style lang="scss">
.search-form {
  flex-wrap: wrap;

  .n-form-item {
    flex: 1;
    min-width: v-bind('props.minWidth');
  }

  .n-date-picker {
    width: 100%;
  }
}
</style>

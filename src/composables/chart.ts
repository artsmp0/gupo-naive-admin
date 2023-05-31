import type { EChartsType, ResizeOpts, EChartsOption } from 'echarts';
import type { Ref } from 'vue';
import echarts from '@/utils/echarts';
import {
  tryOnBeforeUnmount,
  useDebounceFn,
  useFullscreen,
  useTimeoutFn,
  useWindowSize
} from '@vueuse/core';

const defaultResizeOpts: ResizeOpts = {
  animation: {
    duration: 300,
    easing: 'linear'
  }
};

type UseEchartsOption = {
  resizeOpts?: ResizeOpts;
  fullScreenEl?: Ref<HTMLElement | undefined>;
};

export function useChart(wrapper: Ref<HTMLElement | undefined>, options?: UseEchartsOption) {
  const chartInstance = shallowRef<undefined | EChartsType>();
  let resizeObserver: ResizeObserver | undefined;
  const cacheOption = shallowRef<EChartsOption>();
  const { height } = useWindowSize();
  let toggle: (() => Promise<void>) | undefined = undefined;
  let isFullscreen: Ref<boolean> | undefined = undefined;
  if (options?.fullScreenEl) {
    const fullScreenEl = options?.fullScreenEl;
    const fs = useFullscreen(fullScreenEl);
    toggle = fs.toggle;
    isFullscreen = fs.isFullscreen;
    const originHeight = ref('');
    const stop = watch(isFullscreen, async (v) => {
      // 没有全屏元素无需改变图表尺寸
      if (!fullScreenEl?.value) {
        await nextTick();
        stop();
        return;
      }
      if (!v) {
        wrapper.value!.style.height = originHeight.value;
        return;
      }
      originHeight.value = getComputedStyle(wrapper.value!).height;
      wrapper.value!.style.height = height.value + 'px';
    });
  }

  function resize() {
    nextTick(() => {
      chartInstance.value?.resize(options?.resizeOpts || defaultResizeOpts);
    });
  }

  function initChart(theme = 'light') {
    const el = unref(wrapper);
    if (!el) return;
    chartInstance.value = echarts.init(el, theme) as unknown as EChartsType;
    resizeObserver = new ResizeObserver(useDebounceFn(resize, 100, { maxWait: 500 }));
    resizeObserver.observe(el);
    resizeObserver.observe(document.body);
  }
  /**
   *
   * @param option echart option
   * @param clear  clear chart before set option, default false
   */
  function setOptions(option: EChartsOption, clear = false) {
    const el = unref(wrapper);
    cacheOption.value = option;
    if (!el) {
      useTimeoutFn(() => {
        setOptions(option, clear);
      }, 30);
      return;
    }
    useTimeoutFn(() => {
      if (!chartInstance.value) {
        initChart();
        if (!chartInstance.value) return;
      }
      clear && chartInstance.value.clear();
      chartInstance.value.setOption(option);
    }, 30);
  }

  tryOnBeforeUnmount(() => {
    const chartIns = unref(chartInstance);
    if (!chartIns) return;
    chartIns.dispose();
    chartInstance.value = undefined;
    resizeObserver?.unobserve(wrapper.value!);
    resizeObserver?.disconnect();
  });

  return {
    chartInstance,
    setOptions,
    resize,
    fullscreen: {
      isFullscreen,
      toggle
    }
  };
}

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { graphic } from 'echarts';
import { useChart } from '@/composables';
import type { XAXisOption } from 'echarts/types/dist/shared';

const cardRef = ref<HTMLElement | undefined>();
const contentChartRef = ref<HTMLElement | undefined>();
const { setOptions } = useChart(contentChartRef);

const xAxis = ref<string[]>([
  '2022-12-16',
  '2022-12-17',
  '2022-12-18',
  '2022-12-19',
  '2022-12-20',
  '2022-12-21'
]);
const chartsData = ref<number[]>([580, 810, 530, 333, 1090, 885]);
const graphicElements = ref([graphicFactory({ left: '2.6%' }), graphicFactory({ right: 0 })]);
function graphicFactory(side: any) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12
    }
  };
}
setOptions({
  backgroundColor: 'transparent',
  grid: {
    left: '0%',
    right: '0%',
    top: '10',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    offset: 2,
    data: xAxis.value,
    boundaryGap: false,
    axisLabel: {
      color: '#4E5969',
      formatter(value: number, idx: number) {
        if (idx === 0) return '';
        if (idx === xAxis.value.length - 1) return '';
        return `${value}`;
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      interval: (idx: number) => {
        if (idx === 0) return false;
        if (idx === xAxis.value.length - 1) return false;
        return true;
      },
      lineStyle: {
        color: '#E5E8EF'
      }
    },
    axisPointer: {
      show: true,
      lineStyle: {
        color: '#23ADFF',
        width: 2
      }
    }
  } as XAXisOption,
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisLabel: {
      formatter(value: any, idx: number) {
        if (idx === 0) return value;
        return `${value}k`;
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E5E8EF'
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter(params) {
      const [firstElement] = params as any[];
      return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>总内容量</span><span class="tooltip-value">${(
              Number(firstElement.value) * 1000
            ).toLocaleString()}</span></div>
          </div>`;
    },
    className: 'echarts-tooltip-diy'
  },
  graphic: {
    elements: graphicElements.value
  },
  series: [
    {
      data: chartsData.value,
      type: 'line',
      smooth: true,
      // symbol: 'circle',
      symbolSize: 12,
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 2
        }
      },
      lineStyle: {
        width: 3,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(30, 231, 255, 1)'
          },
          {
            offset: 0.5,
            color: 'rgba(36, 154, 255, 1)'
          },
          {
            offset: 1,
            color: 'rgba(111, 66, 251, 1)'
          }
        ])
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(17, 126, 255, 0.16)'
          },
          {
            offset: 1,
            color: 'rgba(17, 128, 255, 0)'
          }
        ])
      }
    }
  ]
});
</script>

<template>
  <NCard>
    <div ref="contentChartRef" class="h-[300px]"></div>
  </NCard>
</template>

<style lang="scss">
.echarts-tooltip-diy {
  background: linear-gradient(
    304.17deg,
    rgb(253 254 255 / 60%) -6.04%,
    rgb(244 247 252 / 60%) 85.2%
  ) !important;
  border: none !important;

  /* Note: backdrop-filter has minimal browser support */

  border-radius: 6px !important;
  backdrop-filter: blur(10px) !important;

  .content-panel {
    display: flex;
    justify-content: space-between;
    width: 164px;
    height: 32px;
    padding: 0 9px;
    margin-bottom: 4px;
    line-height: 32px;
    background: rgb(255 255 255 / 80%);
    border-radius: 4px;
    box-shadow: 6px 0 20px rgb(34 87 188 / 10%);
  }

  .tooltip-title {
    margin: 0 0 10px;
  }

  p {
    margin: 0;
  }

  .tooltip-title,
  .tooltip-value {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    line-height: 15px;
    color: #1d2129;
    text-align: right;
  }

  .tooltip-item-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
  }
}
</style>

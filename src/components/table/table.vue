<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { GupoTableProps } from './table';
import { useData } from './hooks/useData';
import type { DataTableRowKey } from 'naive-ui';
import { useColumn } from './hooks/useColumn';

defineOptions({
  name: 'GupoTable'
});

const props = withDefaults(defineProps<GupoTableProps>(), {
  pagerKeys: () => ({
    total: 'data.pagination.total',
    page: 'page',
    pageSize: 'pageSize',
    list: 'data.list'
  }),
  sorterKeys: () => ({
    field: { orderField: 'isAsc', sortField: 'orderByColumn' },
    order: { ascend: 'asc', descend: 'desc' }
  }),
  selection: false,
  rightUtils: () => ['size', 'reload', 'fullscreen', 'setting']
});

const { computedColumns } = useColumn(() => props as GupoTableProps);
console.log('computedColumns: ', computedColumns);

const { data, loading, pagination, filter, refresh, handleSorterChange } = useData(
  () => props as GupoTableProps
);

const checkedKeys = ref<DataTableRowKey[]>([]);
const checkedRows = shallowRef<any[]>([]);
const handleCheck = (keys: DataTableRowKey[], rows: any[]) => {
  checkedKeys.value = keys;
  checkedRows.value = rows;
};

const getSelectedData = <T extends any>() => {
  return {
    count: checkedKeys.value.length,
    checkedKeys,
    checkedRows: checkedRows as unknown as T[]
  };
};
defineExpose({
  loading,
  filter,
  refresh,
  getSelectedData
});

const $tableWrapper = shallowRef<HTMLDivElement>();
</script>

<template>
  <div ref="$tableWrapper" class="h-full" flex="~ col">
    <div class="py8" flex="~ justify-between items-center">
      <div>
        <span v-if="checkedKeys.length" text-gray>
          当前已选中
          <strong class="text-red">{{ checkedKeys.length }}</strong>
          项，
          <NButton size="small" type="info" text @click="handleCheck([], [])"> 取消所有 </NButton>
        </span>
      </div>
      <div>
        <RightUtils :options="props.rightUtils" :wrapper="$tableWrapper" />
      </div>
    </div>
    <NDataTable
      class="flex-1"
      remote
      :loading="loading"
      :columns="computedColumns"
      :data="data"
      :pagination="pagination"
      v-bind="$attrs"
      :checked-row-keys="checkedKeys"
      @update:sorter="handleSorterChange"
      @update:checked-row-keys="handleCheck"
    >
    </NDataTable>
  </div>
</template>

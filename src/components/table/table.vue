<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { GupoTableProps } from './table';
import { useData } from './hooks/useData';

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
  })
});

const { data, loading, pagination, filter, refresh, handleSorterChange } = useData(
  () => props as GupoTableProps
);

const renderCell = (value: string) => {
  if (!value) return '——';
  return value;
};

defineExpose({
  loading,
  filter,
  refresh
});
</script>

<template>
  <div class="h-full">
    <NDataTable
      class="h-full"
      remote
      :loading="loading"
      :columns="(props.columns as any)"
      :data="data"
      :pagination="pagination"
      v-bind="$attrs"
      :render-cell="renderCell"
      @update:sorter="handleSorterChange"
    >
    </NDataTable>
  </div>
</template>

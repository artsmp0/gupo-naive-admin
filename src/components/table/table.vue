<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { SortState } from 'naive-ui/es/data-table/src/interface';
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
  })
});

const { data, loading, pagination, filter, refresh } = useData(() => props as GupoTableProps);

const handleSorterChange = (sorter: SortState | SortState[]) => {
  console.log('sorter: ', sorter);
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
      :columns="props.columns"
      :data="data"
      :pagination="pagination"
      v-bind="$attrs"
      @update:sorter="handleSorterChange"
    >
    </NDataTable>
  </div>
</template>

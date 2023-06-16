<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="tsx">
import GupoTable, { useTableListApi } from '@/components/table';
import type { TableItem } from '@/api/apis/common';
import { APIS } from '@/api';
import type { TableColumns } from '@/components/table/table';

const columns: TableColumns<TableItem> = [
  {
    key: 'name',
    width: 200,
    title: '表名'
  },
  {
    key: 'notes',
    title: '描述',
    width: 80,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '数据量（行）',
    key: 'rowCount',
    sorter: {
      multiple: 1
    }
  },
  {
    title: '占用磁盘',
    key: 'storageSize',
    sorter: {
      multiple: 3
    }
  },
  {
    title: '最近更新时间',
    key: 'activeTime',
    sorter: {
      multiple: 2
    }
  }
];
const { getList } = useTableListApi(APIS.common['/tag/tb/bind/list'], true);
const $table = shallowRef();

const getSelectedData = () => {
  console.log($table.value?.getSelectedData());
};
</script>

<template>
  <div flex="~ col" class="h-full p16">
    <div class="shrink-0" flex="~ items-center gap-16">
      <NButton @click="getSelectedData">获取选中数据</NButton>
    </div>
    <GupoTable
      ref="$table"
      class="flex-1"
      :row-key="(row: any) => row.urn"
      :columns="columns"
      :sorter-keys="{
        field: { orderField: 'isAsc', sortField: 'orderByColumn' },
        order: { ascend: 'asc', descend: 'desc' }
      }"
      
       flex-height selection 
      :list-api="getList"
      :pager-keys="{
        list: 'data.data.rows',
        page: 'pageNum',
        pageSize: 'pageSize',
        total: 'data.data.total'
      }"
    />
  </div>
</template>

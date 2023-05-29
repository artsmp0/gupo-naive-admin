<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="tsx">
import GupoTable from '@/components/table';
import { FlashOutline } from '@vicons/ionicons5';
import { NButton, type DataTableColumns, NTag } from 'naive-ui';

interface User {
  name: string;
  age: number;
  male: 0 | 1;
}

const getUserList = shallowRef((params: any) => {
  console.log('params: ', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          list: Array.from({ length: params.pageSize }).map((_, index) => ({
            name: `${params.keyword || '我是随机名字'}${
              index + (params.page - 1) * params.pageSize
            }`,
            age: Math.floor(Math.random() * 130),
            male: index % 2 === 0
          })),
          pagination: {
            total: 10000
          }
        }
      });
    }, 300);
  });
});

const columns: DataTableColumns<User> = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'age',
    title: '年龄',
    sorter: true,
    sortOrder: false
  },
  {
    key: 'male',
    title: '性别',
    filterOptionValues: [],
    filterOptions: [
      {
        label: '男',
        value: 0
      },
      {
        label: '女',
        value: 1
      }
    ],
    render(row) {
      return <NTag type={row.male ? 'info' : 'error'}>{row.male ? '男' : '女'}</NTag>;
    }
  },
  {
    key: 'operation',
    title: '操作',
    fixed: 'right',
    width: 100,
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => {
            console.log(row);
          }
        },
        { default: () => '❤️' }
      );
    }
  }
];

const filterText = ref('');
const filterText2 = ref('');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $table = shallowRef<any>();
const handleSearch = () => {
  $table.value?.filter({
    keyword: filterText.value
  });
};
const handleSearch2 = () => {
  $table.value?.filter(
    {
      keyword2: filterText2.value
    },
    false
  );
};

const test = () => {
  getUserList.value = (params: any) => {
    console.log('params: ', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            list: Array.from({ length: params.pageSize }).map((_, index) => ({
              name: `${params.keyword || '我是随机名字'}${
                index + (params.page - 1) * params.pageSize
              }`,
              age: Math.floor(Math.random() * 130),
              male: index % 2 === 0
            })),
            pagination: {
              total: 10000
            }
          }
        });
      }, 300);
    });
  };
};
</script>

<template>
  <div flex="~ col" class="h-full">
    <div class="mb16 shrink-0" flex="~ gap10">
      <NInput
        v-model:value="filterText"
        style="width: 300px"
        type="text"
        placeholder="🔎按回车搜索哦"
        @keydown.enter="handleSearch"
      >
        <template #suffix>
          <NIcon :component="FlashOutline" />
        </template>
      </NInput>
      <NInput
        v-model:value="filterText2"
        style="width: 300px"
        type="text"
        placeholder="不携带第一个输入框的参数🔎"
        @keydown.enter="handleSearch2"
      >
        <template #suffix>
          <NIcon :component="FlashOutline" />
        </template>
      </NInput>
      <NButton @click="$table.refresh()">保持分页刷新</NButton>
      <NButton @click="$table.refresh(false)">不保持分页刷新</NButton>
      <NButton @click="test">change props</NButton>
    </div>
    <GupoTable
      ref="$table"
      class="flex-1"
      :bordered="false"
      striped
      size="small"
      :single-line="true"
      :single-column="true"
      :columns="columns"
      flex-height
      :list-api="getUserList"
      :pagination="{ pageSlot: 10, pageSize: 30 }"
    />
  </div>
</template>

import type { DataTableProps } from 'naive-ui';

export type PagerKeys = {
  total: string;
  page: string;
  pageSize: string;
  list: string;
};

// { field: { orderField: 'isAsc', sortField: 'orderByColumn' }, order: { ascend: 'asc', descend: 'desc' } }
export type SorterKeys = {
  field: { sortField: string; orderField: string };
  order: { ascend: string; descend: string };
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export type GupoTableProps = {
  listApi: (params: any) => Promise<any>;
  /** 分页相关数据获取的路径字符串或者参数名称 */
  pagerKeys?: PagerKeys;
  pagination?: DataTableProps['pagination'];
  columns: DataTableProps['columns'];
  sorterKeys?: SorterKeys;
};

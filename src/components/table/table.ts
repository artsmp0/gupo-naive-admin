import type { DataTableBaseColumn, DataTableProps } from 'naive-ui';

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

export type RightUtils = ('size' | 'fullscreen' | 'reload' | 'setting')[];

/* eslint-disable @typescript-eslint/no-explicit-any */
export type GupoTableProps = {
  listApi: (params: any) => Promise<any>;
  /** 分页相关数据获取的路径字符串或者参数名称 */
  pagerKeys?: PagerKeys;
  pagination?: DataTableProps['pagination'];
  columns: DataTableProps['columns'];
  sorterKeys?: SorterKeys;
  selection?: boolean;
  /** 右侧功能区 */
  rightUtils?: RightUtils;
  size?: DataTableProps['size'];
  /** 对 data 是否采用 ref 包裹还是 shallowRef，一般如果不需要行内编辑，shallowRef 即可，不用深度侦听对象，明显性能会好一些 */
  deepReactive?: boolean;
};

export type TableColumns<T extends any> = (Omit<DataTableBaseColumn<T>, 'key'> & {
  key: keyof T | 'operation';
})[];

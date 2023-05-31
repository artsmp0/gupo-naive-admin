/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import type { GupoTableProps } from '../table';
import type { DataTableSortState } from 'naive-ui';

const resolveArg = (result: any, path: string) => {
  return path.split('.').reduce((res, cur) => {
    return res[cur];
  }, result);
};

export const useData = (propsGetter: () => GupoTableProps) => {
  const props = toValue(propsGetter);
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    showSizePicker: true,
    showQuickJumper: true,
    pageSlot: 5,
    pageSizes: [10, 20, 50, 100],
    itemCount: 50,
    prefix({ itemCount }: any) {
      return `总条数：${itemCount}`;
    },
    //! 为什么要 as any，为了不让 ts 计算这里：
    // The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.
    ...(props.pagination as any),
    onChange: (page: number) => {
      pagination.page = page;
      getData();
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      getData();
    }
  });
  const data = shallowRef<RowData[]>([]);
  const loading = ref(false);
  /** 缓存当前列表的筛选参数 */
  const cachedParams = ref<any>({});
  /** 获取数据和筛选数据 */
  const getData = async (params?: any, withOldParams = true) => {
    // 过滤调用重置分页
    if (params) {
      pagination.page = 1;
    }
    if (withOldParams) {
      cachedParams.value = {
        ...cachedParams.value,
        ...params
      };
    } else {
      cachedParams.value = params;
    }
    try {
      loading.value = true;
      const res = await props.listApi({
        [props.pagerKeys!.pageSize]: pagination.pageSize,
        [props.pagerKeys!.page]: pagination.page,
        ...cachedParams.value
      });
      data.value = resolveArg(res, props.pagerKeys!.list);
      pagination.itemCount = resolveArg(res, props.pagerKeys!.total);
    } catch (error) {
      console.log('error: ', error);
    } finally {
      loading.value = false;
    }
  };
  getData();
  /** 刷新列表 */
  const refresh = (keepPage = true) => {
    if (keepPage) {
      getData();
    } else {
      pagination.page = 1;
      getData();
    }
  };
  /** 处理后端多列排序的逻辑 */
  const handleSorterChange = (sorter: DataTableSortState | DataTableSortState[] | null) => {
    let sorterParams: any;
    const sortField = props.sorterKeys!.field.sortField;
    const orderField = props.sorterKeys!.field.orderField;
    const ascend = props.sorterKeys!.order.ascend;
    const descend = props.sorterKeys!.order.descend;
    if (Array.isArray(sorter)) {
      sorterParams = sorter
        .sort((a, b) => (a.sorter as any).multiple - (b.sorter as any).multiple)
        .reduce(
          (res, cur) => {
            return cur.order
              ? {
                  [sortField]: [cur.columnKey, ...res[sortField]],
                  [orderField]: [cur.order === 'ascend' ? ascend : descend, ...res[orderField]]
                }
              : res;
          },
          {
            [sortField]: [],
            [orderField]: []
          } as any
        );
    }
    sorterParams[sortField] = sorterParams[sortField].join(',');
    sorterParams[orderField] = sorterParams[orderField].join(',');
    cachedParams.value = {
      ...cachedParams.value,
      ...sorterParams
    };
    getData();
  };

  return {
    loading,
    data,
    pagination,
    refresh,
    filter: getData,
    handleSorterChange
  };
};

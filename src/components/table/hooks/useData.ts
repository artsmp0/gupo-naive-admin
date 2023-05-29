/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import type { GupoTableProps } from '../table';

const resolveArg = (result: any, path: string) => {
  return path.split('.').reduce((res, cur) => {
    return res[cur];
  }, result);
};

export const useData = (propsGetter: () => GupoTableProps) => {
  const props = toValue(propsGetter);
  const pagination = reactive(
    props.pagination
      ? {
          page: 1,
          pageSize: 10,
          showSizePicker: true,
          showQuickJumper: true,
          pageSlot: 5,
          pageSizes: [10, 20, 50, 100],
          itemCount: 50,
          prefix({ itemCount }: any) {
            return `总条数：${itemCount}`;
          },
          //! 为什么要 as any，为了不让 ts 计算这里：The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.
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
        }
      : {
          page: 1,
          pageSize: 10,
          showSizePicker: true,
          showQuickJumper: true,
          pageSlot: 5,
          pageSizes: [10, 20, 50, 100],
          itemCount: 50,
          prefix({ itemCount }: any) {
            return `总条数：${itemCount}`;
          },
          onChange: (page: number) => {
            pagination.page = page;
            getData();
          },
          onUpdatePageSize: (pageSize: number) => {
            pagination.pageSize = pageSize;
            pagination.page = 1;
            getData();
          }
        }
  );
  const data = shallowRef<RowData[]>([]);
  const loading = ref(false);

  const cachedParams = ref<any>({});
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
        pageSize: pagination.pageSize,
        page: pagination.page,
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

  const refresh = (keepPage = true) => {
    if (keepPage) {
      getData();
    } else {
      pagination.page = 1;
      getData();
    }
  };

  return {
    loading,
    data,
    pagination,
    refresh,
    filter: getData
  };
};

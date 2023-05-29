/* eslint-disable @typescript-eslint/no-explicit-any */
import {} from 'lodash-es';

/** 获取api函数的query参数类型 */
export type GetRequestParams<T> = T extends { params: infer P1 }
  ? P1
  : T extends { params?: infer P2 }
  ? P2
  : never;
/** 针对api函数的请求方式是post的情况 */
export type GetRequestData<T> = T extends { data: infer P1 }
  ? P1
  : T extends { data?: infer P2 }
  ? P2
  : never;
/** 获取api方法的第一个参数 */
export type GetParametersOne<T extends (...args: any) => any> = Prettify<Parameters<T>[0]>;

/** 用于获取正确的 params 参数类型 */
export function useTableListApi<T extends (...args: any) => any>(
  api: T,
  isGet: true
): {
  getList: (params: GetRequestParams<GetParametersOne<T>>) => ReturnType<T>;
  passDefaultList: (params: GetRequestParams<GetParametersOne<T>>) => any;
};
export function useTableListApi<T extends (...args: any) => any>(
  api: T,
  isGet: false
): {
  getList: (params: GetRequestParams<GetParametersOne<T>>) => ReturnType<T>;
  passDefaultList: (params: GetRequestParams<GetParametersOne<T>>) => any;
};
export function useTableListApi<T extends (...args: any) => any>(api: T, isGet = true): any {
  const getList = isGet
    ? (params: GetRequestParams<GetParametersOne<T>>): ReturnType<T> => {
        return api({ params });
      }
    : (params: GetRequestData<GetParametersOne<T>>): ReturnType<T> => {
        return api({ data: params });
      };

  const passDefaultList = (params: GetRequestParams<GetParametersOne<T>>) => {
    return (p: any) => {
      return getList({ ...(params as any), ...p });
    };
  };

  return {
    getList,
    passDefaultList
  };
}

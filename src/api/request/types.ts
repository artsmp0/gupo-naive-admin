import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * makeRequest 函数返回的最终结果
 * @param data: 接口结果
 * @param err: 如果有就说明接口报错了
 */
export type MakeRequestRes<D = unknown> = {
  data: D;
  err?: AxiosResponse | D;
  response?: AxiosResponse<D>;
};
/** 请求配置 */
export type RequestConfig<D = unknown> = {
  /**
   * 是否显示业务错误的弹窗
   * @default true
   */
  showMessage?: boolean;
  /**
   * 是否允许同一接口同时发起多次请求
   * @default false
   */
  multiple?: boolean;
  /**
   * 路径参数方式
   * @default undefined
   */
  args?: unknown;
  /** 授权 api 要额外处理 */
  isAuthApi?: boolean;
} & AxiosRequestConfig<D>;

/** 定义接口业务状态的码 */
export const enum ResponseCode {
  success = '200',
  authSuccess = 200,
  authFailed = 401
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GetUnionArgs<T extends string | undefined> = T extends `${infer L}{${infer M}}${infer R}`
  ? M | GetUnionArgs<R>
  : never;
/** 自动计算路径参数 */
export type GetFinalArgs<T extends string | undefined> = {
  [P in GetUnionArgs<T>]?: string | number;
};

// ============================以下内容可能需要按后端的格式修改============================

/** 接口的基本形状 */
export type BaseRes<T = unknown> = {
  code: string | number;
  message: string;
  data: T;
};

/** 分页接口的基本形状：一般在 DataRes['data'] 里 */
export type PaginationRes<T> = BaseRes & {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

/** 分页接口基本参数 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

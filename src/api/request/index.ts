/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { addTokenHandler } from './interceptors/addToken';
import { parseArgsHandler } from './interceptors/parseArgs';
import { repeatReqHandler } from './interceptors/repeatReqHandler';
import type { BaseRes, GetFinalArgs, MakeRequestRes, RequestConfig } from './types';
import { resHandler } from './interceptors/resHandler';

export interface MakeRequestFn {
  /** 仅传递接口返回的结果类型 */
  <Payload = unknown>(config: RequestConfig): (
    reqConfig?: Partial<RequestConfig>
  ) => Promise<MakeRequestRes<Payload>>;
  /** 传递接口 querystring 请求参数和返回结果类型 */
  <Payload = unknown, Params = undefined>(
    config: Partial<Omit<RequestConfig, 'params'>> & { params?: Params }
  ): (
    reqConfig?: Partial<Omit<RequestConfig, 'params'>> & { params?: Params }
  ) => Promise<MakeRequestRes<Payload>>;
  /** 传递接口 querystring 请求参数或 post data 请求参数和返回结果类型 */
  <Payload = unknown, Params = undefined, Data = undefined>(
    config: Partial<Omit<RequestConfig<Data>, 'params'>> & { params?: Params }
  ): (
    reqConfig?: Partial<Omit<RequestConfig<Data>, 'params'>> & { params?: Params }
  ) => Promise<MakeRequestRes<Payload>>;
  /** 传递接口 querystring 请求参数或 post data 请求参数或 路径参数 和返回结果类型 */
  <
    Payload = unknown,
    Params = undefined,
    Data = undefined,
    ArgsURL extends string | undefined = undefined
  >(
    config: Partial<Omit<RequestConfig<Data>, 'params' | 'args'>> & {
      params?: Params;
      args?: GetFinalArgs<ArgsURL>;
    }
  ): (
    reqConfig?: Partial<Omit<RequestConfig<Data>, 'params' | 'args'>> & {
      params?: Params;
      args?: GetFinalArgs<ArgsURL>;
    }
  ) => Promise<MakeRequestRes<Payload>>;
}

const instance = axios.create({
  timeout: 1000 * 60,
  baseURL: import.meta.env.VITE_APP_API_URL
});
instance.interceptors.request.use(addTokenHandler.request.onFulfilled);
// 解析路径参数
instance.interceptors.request.use(parseArgsHandler.request.onFulfilled);
instance.interceptors.request.use(repeatReqHandler.request.onFulfilled);
instance.interceptors.response.use(resHandler.response.onFulfilled, resHandler.response.onRejected);

export const makeRequest: MakeRequestFn = <Payload extends BaseRes>(config: RequestConfig) => {
  return async function (reqConfig?: Partial<RequestConfig>) {
    const finalConfig: RequestConfig = {
      showMessage: true,
      multiple: false,
      ...config,
      ...reqConfig
    };

    const response = await instance.request<Payload>(finalConfig);

    return response;
  };
};

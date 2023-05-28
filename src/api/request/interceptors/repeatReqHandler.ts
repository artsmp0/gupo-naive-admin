import type { InternalAxiosRequestConfig } from 'axios';
import type { RequestConfig } from '../types';

const controllerMap: Map<string, AbortController> = new Map();

export const repeatReqHandler = {
  request: {
    onFulfilled(config: InternalAxiosRequestConfig) {
      const { url, multiple } = config as RequestConfig;
      let controller = controllerMap.get(url!);
      if (!multiple && controller) {
        controller.abort();
      }
      controller = new AbortController();
      // 如有需要，请自定义唯一标识，默认采用 url
      controllerMap.set(url!, controller);
      return {
        ...config,
        signal: controller.signal
      };
    }
  },
  response: {
    // 这里定义响应拦截器
    // onFulfilled(response: AxiosResponse) {}
  }
};

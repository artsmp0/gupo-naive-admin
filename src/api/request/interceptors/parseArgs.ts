import type { InternalAxiosRequestConfig } from 'axios';
import type { RequestConfig } from '../types';

export const parseArgsHandler = {
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      const { url, args } = config as RequestConfig;
      if (args && url) {
        const lostParams: string[] = [];
        const replacedUrl = url.replace(/\{(.+?)\}/g, (res, arg: string) => {
          if (!(args as Record<string, string>)[arg]) {
            lostParams.push(arg);
          }
          return (args as Record<string, string>)[arg] as string;
        });
        if (lostParams.length) {
          return Promise.reject(new Error('存在丢失的路径参数：' + lostParams.join(',')));
        }
        return { ...config, url: replacedUrl };
      }
      return config;
    }
  }
};

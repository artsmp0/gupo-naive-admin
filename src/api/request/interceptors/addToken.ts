import { useUserStore } from '@/stores/user';
import type { InternalAxiosRequestConfig } from 'axios';

export const addTokenHandler = {
  request: {
    onFulfilled(config: InternalAxiosRequestConfig) {
      const userStore = useUserStore();
      const token = userStore.token;
      if (token && config.headers) {
        (config.headers as Recordable)['Authorization'] = 'Bearer ' + token;
      }

      return {
        ...config
      };
    }
  },
  response: {
    // 这里定义响应拦截器
    // onFulfilled(response: AxiosResponse) {}
  }
};

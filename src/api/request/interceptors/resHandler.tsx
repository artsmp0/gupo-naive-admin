/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios';
import { type BaseRes, ResponseCode } from '../types';
import router from '@/router';
import { useDiscrete } from '@/composables';
import { useUserStore } from '@/stores/user';
import { isDdOrZzd } from '@/utils';
import { NButton } from 'naive-ui';

let alreadyShowError = false;

/** 处理授权错误 */
function handleAuth(response: AxiosResponse) {
  const { notification } = useDiscrete();

  const { data } = response;
  if (data.code !== ResponseCode.authSuccess) {
    if (alreadyShowError) {
      return {
        err: response
      };
    }
    alreadyShowError = true;
    const userStore = useUserStore();
    if (isDdOrZzd()) {
      userStore.clearData();
      router.replace({
        name: 'Forbidden',
        query: {
          code: 401
        }
      });
    } else {
      notification.warning({
        title: '访问失败！',
        description: '无权限或登录失效，请重新登录',
        action() {
          return (
            <NButton
              type="warning"
              onClick={() => {
                userStore.logout();
              }}
            >
              去登录
            </NButton>
          );
        }
      });
    }
    return {
      err: response
    };
  }
  return {
    data: data.data,
    response
  };
}

export const resHandler = {
  response: {
    // 这里定义响应拦截器
    // onFulfilled(response: AxiosResponse) {}
    onFulfilled: (response: AxiosResponse<BaseRes>) => {
      const { message } = useDiscrete();

      const { data } = response;
      if (data instanceof Blob) {
        return {
          data,
          response,
          err: null
        } as unknown as AxiosResponse;
      }
      if ((response.config as unknown as any).isAuthApi) {
        return handleAuth(response) as unknown as AxiosResponse;
      }
      if (data.code !== ResponseCode.success) {
        // 业务错误直接这里报错的话，要求后端 msg 必填
        (response.config as unknown as any).showMessage && message.error(data.message);
        return {
          data: data,
          response,
          err: data
        } as unknown as AxiosResponse;
      }

      return {
        data: response.data,
        response: response,
        err: null
      } as unknown as AxiosResponse;
    },
    onRejected: (err: any) => {
      const { message } = useDiscrete();
      // judge err is cancel
      if (err.code === 'ECONNABORTED') {
        message.warning('请求超时取消，请重试或联系管理员！');
      }
      if (err.code === 'ERR_NETWORK') {
        message.error('貌似断网了喔~~');
      }
      // 请求状态码非2xx或者网络错误
      console.warn('request err: ', err);
      message.error(err.message);
      return { err, data: undefined, response: undefined } as unknown as AxiosResponse;
    }
  }
};

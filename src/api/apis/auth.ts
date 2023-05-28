import type { Org, UserInfo } from '@/stores/user';
import type { PermissionData } from '@/stores/permission';
import { makeRequest } from '../request';
const userApiUrl = import.meta.env.VITE_USER_API_URL;

export default {
  ['/open/user/tokenDetail']: makeRequest<UserInfo>({
    url: '/open/user/tokenDetail',
    baseURL: userApiUrl,
    isAuthApi: true
  }),
  ['/open/permission/router']: makeRequest<
    PermissionData,
    { system_code: string; org_id: string | number }
  >({
    url: '/open/permission/router',
    baseURL: userApiUrl,
    isAuthApi: true
  }),
  ['/org/user/system/org']: makeRequest<Org[], { system_code: string }>({
    url: '/org/user/system/org',
    baseURL: userApiUrl,
    isAuthApi: true
  }),
  ['/apiUser/logout']: makeRequest<unknown>({
    url: '/apiUser/logout',
    baseURL: userApiUrl,
    isAuthApi: true
  })
};

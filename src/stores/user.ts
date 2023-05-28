import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { APIS } from '@/api';

export type Org = {
  id: number;
  name: string;
};

export type UserInfo = {
  account: string;
  name: string;
  id: number;
  phone: string;
  img: string;
};

export type AuthQuery = { token: string; system_code: string; org_id: number };

export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', '');
  const orgId = useLocalStorage<string | number>('orgId', 1);
  const systemCode = useLocalStorage('systemCode', '');
  const userInfo = ref<UserInfo | undefined>(undefined);
  const orgListMenu = ref<Org[]>([
    {
      id: 1,
      name: '杭州古珀医疗科技有限公司'
    },
    {
      id: 2,
      name: '萧山卫健'
    }
  ]);

  const setToken = (value: string) => (token.value = value);
  const setSystemCode = (value: string) => (systemCode.value = value);
  const setOrgId = (value: number | string) => (orgId.value = value);
  const setUserInfo = (value: UserInfo) => (userInfo.value = value);
  const setOrgListMenu = (value: Org[]) => (orgListMenu.value = value);

  const clearData = () => {
    token.value = '';
    systemCode.value = '';
    orgId.value = -1;
  };

  // 设置用户信息
  const initUser = async () => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'false') {
      const { data } = await APIS.auth['/open/user/tokenDetail']();
      setUserInfo(data);
    }
  };

  // 获取左上角切换机构
  const getUserSystemOrg = async () => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'false') {
      const { data } = await APIS.auth['/org/user/system/org']();
      setOrgListMenu(data);
    }
  };

  const logout = () => {
    clearData();
    window.location.replace(import.meta.env.VITE_LOGIN_URL);
  };

  const setAuth = async (query: AuthQuery) => {
    const { token: queryToken, system_code: querySystemCode, org_id: queryOrgId } = query;
    if (queryToken && queryToken !== token.value) setToken(queryToken);
    if (querySystemCode && querySystemCode !== systemCode.value) setSystemCode(querySystemCode);
    if (queryOrgId && queryOrgId !== orgId.value) setOrgId(Number(queryOrgId));
    if (!Object.keys(userInfo.value || {}).length) await initUser();
    if (!orgListMenu.value?.length) await getUserSystemOrg();
  };
  return {
    token,
    setToken,
    systemCode,
    setSystemCode,
    orgId,
    setOrgId,
    userInfo,
    orgListMenu,
    setUserInfo,
    setOrgListMenu,
    clearData,
    initUser,
    logout,
    getUserSystemOrg,
    setAuth
  };
});

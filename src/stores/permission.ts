import { defineStore } from 'pinia';
import router from '@/router';
import Layout from '@/layout/index.vue';
import mockData from '@/router/mock.json';
import { camel2kebab } from '@/utils';
import type { Component } from 'vue';
import { APIS } from '@/api';
import { useUserStore } from './user';
import type { RouteLocationNormalized, RouteMeta } from 'vue-router';
import { fallbackRoutes } from '@/router/fallback-routes';

export type MenuItemType = {
  path: string;
  name: string;
  redirect?: string;
  component?: Component | null;
  meta?: RouteMeta;
  children: MenuItemType[];
  parentPath?: string;
};
type Button = { title: string; path: string };
export type PermissionData = {
  router: MenuItemType[];
  button: Button[];
  otherPage: MenuItemType[];
};

export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore();

  const menuList = ref<MenuItemType[]>([]);
  const flatMenuList = ref<MenuItemType[]>([]);
  const hasRoute = ref(false);
  const permission = ref<Button[]>([]);

  const setHasRoute = (value: boolean) => (hasRoute.value = value);
  const setMenuList = (value: MenuItemType[]) => (menuList.value = value);
  const setFlatMenuList = (value: MenuItemType[]) => (flatMenuList.value = value);
  const setPermission = (value: Button[]) => (permission.value = value);

  const setRoutes = (menus: PermissionData | undefined) => {
    if (!menus) return;
    const routes: MenuItemType = {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '',
      children: [] as MenuItemType[]
    };
    const generateMeta = (meta: RouteMeta = {}) => {
      return { ...meta };
    };
    const modules = import.meta.glob('../views/**/*.vue');
    const generateRoute = (item: MenuItemType, parentPath?: string) => {
      return {
        path: camel2kebab(item.path ?? ''),
        parentPath,
        name: item.path?.slice(1).replace(/\//g, '.'),
        meta: item.meta,
        component: modules[`../views${item.path}/index.vue`]
      };
    };
    const generateRoutes = (list: MenuItemType[], parentPath?: string) => {
      const menuRouter = [] as MenuItemType[];
      const flatMenuRoutes = [] as MenuItemType[];
      list.forEach((item) => {
        let children = [] as MenuItemType[];
        if (item.children && item.children.length > 0) {
          const { flatMenuRoutes: childrenRoutes, menuRouter: childrenRouter } = generateRoutes(
            item.children,
            camel2kebab(item.path ?? '')
          );
          flatMenuRoutes.push(...childrenRoutes);
          children = childrenRouter || [];
        }
        const route = {
          ...generateRoute(item, parentPath),
          children
        } as MenuItemType;

        if (item.redirect) route.redirect = item.redirect;
        // 多判断 !item.children，如果不写的话，仅当 item.children 为 [] 时，会进入 if 语句
        if (!item.children || item.children?.length === 0) routes?.children?.push(route);
        if (item.children?.length > 0 && item.meta?.isPage)
          // 这里要清除子路由，不然会被视为嵌套路由
          routes?.children?.push({
            ...route,
            children: []
          });
        menuRouter.push(route);
        flatMenuRoutes.push(route);
      });
      return { flatMenuRoutes, menuRouter };
    };
    const { flatMenuRoutes, menuRouter } = generateRoutes(menus.router);

    // 表示不会出现在 layout 之中，也就是没有头部和侧边的独立页面
    const otherPageRoutes = (menus.otherPage || [])
      .map((item) => generateRoute(item))
      .map((item) => ({ ...item, meta: generateMeta(item.meta) }));

    if (otherPageRoutes.length > 0) {
      // otherPageRoutes 表示不需要头部和侧栏的路由
      otherPageRoutes.forEach((route) => router.addRoute(route));
    }

    if (routes.children && routes.children.length > 0) {
      // 如果有菜单的路由则加入
      routes.redirect = routes?.children?.[0]?.path;
      router.addRoute([routes][0]);
      router.addRoute({
        path: '/:catchAll(.*)',
        redirect: { path: '/404' }
      });

      setMenuList(menuRouter);
      setFlatMenuList(flatMenuRoutes);
    }
    // 设置页面展示菜单数组
    setHasRoute(true);

    // 最后加入 fallbackRoutes
    fallbackRoutes.forEach((route) => {
      router.addRoute(route);
    });
  };
  const initRoutes = async () => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      setPermission(mockData.button);
      setRoutes(mockData as unknown as PermissionData);
    } else {
      // 有接口则替换为接口返回 data 即可
      const { data } = await APIS.auth['/open/permission/router']({
        params: { org_id: userStore.orgId, system_code: userStore.systemCode }
      });
      setPermission(data?.button);
      setRoutes(data);
      if (!data) return {};
    }

    // 返回登录成功后前往的页面地址
    return {
      redirectRoute:
        menuList.value[0]?.children?.[0]?.path ||
        menuList.value[0]?.path ||
        camel2kebab(mockData.otherPage?.[0].path) ||
        '/'
    };
  };
  const getKeepAliveName = (arr: MenuItemType[]) => {
    const v: string[] = [];
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index];
      if (item.meta?.keepAlive) {
        v.push(item?.name);
      }
      if (item.children.length) {
        v.push(...getKeepAliveName(item.children));
      }
    }
    return v;
  };
  const getKeepAliveList = () => {
    return getKeepAliveName(menuList.value);
  };

  const cachedPages = ref(new Set<string>());
  const cacheRoutes = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (!from.meta.keepAlive) return;
    const {
      meta: { keepAlive },
      name
    } = from;
    const { name: toName } = to;
    if (!name || typeof name !== 'string') return;
    // 针对特定页面缓存
    if (Array.isArray(keepAlive)) {
      if (!toName || typeof toName !== 'string') return;
      const transformNames = keepAlive.map((name) => {
        return name.replace(/\//g, '.').slice(1);
      });
      if (transformNames.includes(toName)) {
        // 说明当前路由需要被缓存
        if (cachedPages.value.has(name)) {
          return;
        }
        cachedPages.value.add(name);
      } else {
        if (cachedPages.value.has(name)) {
          cachedPages.value.delete(name);
          return;
        }
      }
      return;
    }
    // 全局缓存
    if (cachedPages.value.has(name)) {
      return;
    }
    cachedPages.value.add(name);
  };
  const keepAliveList = computed(() => getKeepAliveName(menuList.value));
  // 按钮权限判断 buttonName:Array/String
  const vPermission = (buttonName: string[] | string) => {
    const params = ([] as string[]).concat(buttonName);
    const resultArr = permission.value.filter((item) => {
      return params.includes(item.title);
    });
    return !!resultArr.length;
  };
  return {
    menuList,
    flatMenuList,
    hasRoute,
    permission,
    keepAliveList,
    cachedPages,
    cacheRoutes,
    setHasRoute,
    setMenuList,
    setPermission,
    setRoutes,
    initRoutes,
    getKeepAliveList,
    vPermission
  };
});

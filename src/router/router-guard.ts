import router from '@/router';
import { useUserStore, type AuthQuery } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
import { useTitle } from '@vueuse/core';
import { useDiscrete } from '@/composables';

const { loadingBar } = useDiscrete();

let indexRoute: string;
router.beforeEach(async (to, from) => {
  loadingBar.start();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  permissionStore.cacheRoutes(to, from);

  useTitle(import.meta.env.VITE_APP_TITLE);

  userStore.setAuth(to.query as unknown as AuthQuery);

  if (!permissionStore.hasRoute && !to.meta.whiteList) {
    const { redirectRoute } = await permissionStore.initRoutes();
    indexRoute = redirectRoute as string;
    if (!redirectRoute)
      return {
        path: '/401',
        query: {
          code: 401
        }
      };
    return { ...to, replace: true, path: to.path === '/' ? redirectRoute : to.path };
  }
  // 避免一开始进入的是不存在页面，重定向到 404 页面导致回到主页按钮失效的情况
  if (to.path === '/') {
    return {
      path: indexRoute,
      replace: true,
      query: from.query
    };
  }
});

router.afterEach(() => {
  loadingBar.finish();
});

import router from '@/router';
import { useUserStore, type AuthQuery } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
import { useTitle } from '@vueuse/core';
import { useDiscrete } from '@/composables';

const { loadingBar } = useDiscrete();

router.beforeEach(async (to, from) => {
  loadingBar.start();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  permissionStore.cacheRoutes(to, from);

  useTitle(import.meta.env.VITE_APP_TITLE);

  userStore.setAuth(to.query as unknown as AuthQuery);
  if (!permissionStore.hasRoute && !to.meta.whiteList) {
    const { redirectRoute } = await permissionStore.initRoutes();
    if (!redirectRoute)
      return {
        path: '/401',
        query: {
          code: 401
        }
      };
    return { ...to, replace: true, path: to.path === '/' ? redirectRoute : to.path };
  }
});

router.afterEach(() => {
  loadingBar.finish();
});

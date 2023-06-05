export const fallbackRoutes = [
  {
    name: 'Redirect',
    path: '/redirect/:path(.*)',
    component: () => import('@/layout/pages/redirect.vue')
  },
  {
    name: 'Auth',
    path: '/auth',
    component: () => import('@/layout/pages/auth.vue'),
    meta: { whiteList: true }
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/layout/pages/404.vue'),
    meta: { whiteList: true }
  },
  {
    name: 'Forbidden',
    path: '/401',
    component: () => import('@/layout/pages/401.vue'),
    meta: { whiteList: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/layout/pages/404.vue'),
    meta: { whiteList: true }
  }
];

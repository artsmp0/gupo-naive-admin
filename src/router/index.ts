import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      name: 'Redirect',
      path: '/redirect',
      component: Layout,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/layout/pages/redirect.vue')
        }
      ]
    }
  ]
});

export default router;

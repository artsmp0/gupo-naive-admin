import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/Overview/index.vue')
        }
      ]
    }
  ]
});

export default router;

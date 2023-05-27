import { createRouter, createWebHistory } from 'vue-router';
import Overview from '@/views/Overview/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Overview
    }
  ]
});

export default router;

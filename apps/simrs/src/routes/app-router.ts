import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import { unitRoutes } from './modules/unit.routes';

const appRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      component: AppLayout,
      path: '/',
      children: [...unitRoutes],
    },
  ],
});

export default appRouter;

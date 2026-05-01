import { createRouter, createWebHistory } from 'vue-router';
import { unitRoutes } from './base/unit.routes';
import { staffRoutes } from './base/staff.routes';
import NotFoundPage from '@genossys-hospital/presentation/shared/base/pages/NotFoundPage.vue';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...unitRoutes,
    ...staffRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

export default appRouter;

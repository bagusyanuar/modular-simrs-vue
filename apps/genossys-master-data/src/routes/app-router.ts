import { createRouter, createWebHistory } from 'vue-router';
import { unitRoutes } from './base/unit.routes';
import { staffRoutes } from './base/staff.routes';
import NotFoundPage from '@genossys-hospital/presentation/shared/base/pages/NotFoundPage.vue';
import { dashboardRoutes } from './base/dashboard.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...dashboardRoutes,
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

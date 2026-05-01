import { createRouter, createWebHistory } from 'vue-router';
import { V2Layout } from '@genrs/ui/layouts';
import { unitRoutes } from './base/unit.routes';
import { staffRoutes } from './base/staff.routes';
import { dashboardRoutes } from './base/dashboard.routes';
import NotFoundPage from '@genossys-hospital/presentation/shared/base/pages/NotFoundPage.vue';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: V2Layout,
      meta: { public: false },
      children: [...dashboardRoutes, ...unitRoutes, ...staffRoutes],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

export default appRouter;

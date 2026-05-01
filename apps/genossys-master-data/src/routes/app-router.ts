import { createRouter, createWebHistory } from 'vue-router';
import { V2Layout } from '@genrs/ui/layouts';
import { tenantRoutes } from 'virtual:tenant-routes';
import NotFoundPage from '@genossys-hospital/presentation/shared/base/pages/NotFoundPage.vue';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: V2Layout,
      meta: { public: false },
      children: [...tenantRoutes],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

export default appRouter;

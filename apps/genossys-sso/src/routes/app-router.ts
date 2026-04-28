import { createRouter, createWebHistory } from 'vue-router';
import tenantRoutes from 'virtual:tenant-routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...tenantRoutes],
});

export default appRouter;

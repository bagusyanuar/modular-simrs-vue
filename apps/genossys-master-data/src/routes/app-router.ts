import { createRouter, createWebHistory } from 'vue-router';
import { unitRoutes } from './base/unit.routes';
import { staffRoutes } from './base/staff.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...unitRoutes, ...staffRoutes],
});

export default appRouter;

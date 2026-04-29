import { createRouter, createWebHistory } from 'vue-router';
import { unitRoutes } from './base/unit.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...unitRoutes],
});

export default appRouter;

import { createRouter, createWebHistory } from 'vue-router';
import { clientRoutes } from './base/client.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...clientRoutes],
});

export default appRouter;

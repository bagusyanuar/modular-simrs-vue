import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from './base/auth.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes],
});

export default appRouter;

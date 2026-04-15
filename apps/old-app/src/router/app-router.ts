import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from './auth.routes';
import { dashboardRoutes } from './dashboard.route';

const router = createRouter({
  history: createWebHistory(),
  routes: [...authRoutes, ...dashboardRoutes],
});

export default router;

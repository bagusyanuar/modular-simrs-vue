import { createRouter, createWebHistory } from 'vue-router';
import { dashboardRoutes } from './dashboard.route';

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', redirect: '/dashboard' }, ...dashboardRoutes],
});

export default router;

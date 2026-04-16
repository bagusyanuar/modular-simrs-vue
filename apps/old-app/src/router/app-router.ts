import { createRouter, createWebHistory } from 'vue-router';
import { dashboardRoutes } from './dashboard.route';

const router = createRouter({
  history: createWebHistory(),
  routes: [...dashboardRoutes],
});

export default router;

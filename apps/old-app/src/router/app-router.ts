import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from './auth.routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [...authRoutes],
});

export default router;

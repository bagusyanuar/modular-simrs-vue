import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLayout,
      meta: { requiresAuth: true }
    },
    // Add other routes here
  ]
});

export default router;

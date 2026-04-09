import type { RouteRecordRaw } from 'vue-router';
import { SessionManager } from '@genrs/auth';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../pages/login/LoginPage.vue'),
    beforeEnter: (to, _from, next) => {
      if (SessionManager.isAuthenticated()) {
        window.location.href = '/simrs/';
        return;
      }
      next();
    },
  },
  {
    path: '/authorize',
    redirect: '/',
  },
];

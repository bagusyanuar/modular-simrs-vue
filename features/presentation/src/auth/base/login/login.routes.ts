import type { RouteRecordRaw } from 'vue-router';
import { SessionManager } from '@genrs/auth';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    alias: '/', // Support both /sso/ and /sso/login
    component: () => import('./LoginPage.vue'),
    meta: { public: true }, // Skip createSSOGuard jika dipakai di auth app
    beforeEnter: (to, _from, next) => {
      // If already authenticated, redirect away from login page
      if (SessionManager.isAuthenticated()) {
        const rawReturnUrl = to.query.return_url as string;
        const target = rawReturnUrl
          ? decodeURIComponent(rawReturnUrl)
          : import.meta.env.VITE_PATH_V1 || '/';
        console.log(`[AuthRoutes] Already authenticated. Redirecting to ${target}`);
        window.location.href = target;
        return false; // Abort Vue Router navigation
      }
      next();
    },
  },
  {
    path: '/authorize', // Legacy placeholder if needed
    redirect: '/login',
  },
];

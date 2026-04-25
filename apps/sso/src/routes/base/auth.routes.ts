import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/modules/sso/LoginPage.vue'),
    meta: { public: true },
  },
];

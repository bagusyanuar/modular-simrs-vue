import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@genrs/presentation/sso/base/login/LoginPage.vue'),
    meta: { public: true },
  },
];

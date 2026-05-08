import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import('@genossys-hospital/presentation/sso/base/pages/LoginPage.vue'),
    meta: { public: true },
  },
];

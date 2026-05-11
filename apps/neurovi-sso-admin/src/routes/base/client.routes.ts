import type { RouteRecordRaw } from 'vue-router';

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import('@genossys-hospital/presentation/sso-client/base/pages/SSOClientPage.vue'),
    meta: { public: true },
  },
];

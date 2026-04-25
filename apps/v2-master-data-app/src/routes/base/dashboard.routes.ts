import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import('@genrs/presentation/master-data/base/dashboard/pages/Dashboard.vue'),
    meta: { public: false },
  },
];

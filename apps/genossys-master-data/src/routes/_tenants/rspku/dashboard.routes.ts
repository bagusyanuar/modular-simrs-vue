import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'dashboard',
    component: () =>
      import('@genossys-hospital/presentation/dashboard/_tenants/rspku/pages/DashboardPage.vue'),
  },
];

import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@page/dashboard/DashboardPage.vue'),
  },
];

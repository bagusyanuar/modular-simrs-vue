import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'dashboard',
    component: () =>
      import(
        '@genossys-hospital/presentation/dashboard/base/pages/DashboardPage.vue'
      ),
  },
];

import type { RouteRecordRaw } from 'vue-router';
import { V2Layout } from '@genrs/ui/layouts';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: V2Layout,
    children: [
      {
        path: '',
        component: () =>
          import('@genossys-hospital/presentation/dashboard/base/pages/DashboardPage.vue'),
      },
    ],
    meta: { public: false },
  },
];

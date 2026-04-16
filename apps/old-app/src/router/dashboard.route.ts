import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/components/layouts/AppLayout.vue';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: AppLayout,
    children: [
      {
        path: '',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
      },
      {
        path: '/installation',
        component: () => import('@/pages/installation/InstallationPage.vue'),
      },
    ],
  },
];

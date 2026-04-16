import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/components/layouts/AppLayout.vue';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',
        alias: '', // Agar rute root '/' menampilkan Dashboard juga
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
      },
      {
        path: 'installation',
        name: 'installation',
        component: () => import('@/pages/installation/InstallationPage.vue'),
      },
      // Bisa tambahkan rute lain di sini nantinya
    ],
  },
];

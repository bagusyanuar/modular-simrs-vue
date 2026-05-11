import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '../../components/AppLayout.vue';

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () =>
          import('@genossys-hospital/presentation/sso-client/base/pages/SSOClientPage.vue'),
        meta: { public: true },
      },
    ],
  },
];

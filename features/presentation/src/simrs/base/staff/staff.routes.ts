import type { RouteRecordRaw } from 'vue-router';

export const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/staff',
    children: [
      {
        path: '',
        component: () => import('@page/staff/Staff.vue'),
      },
    ],
  },
];

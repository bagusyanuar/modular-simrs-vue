import type { RouteRecordRaw } from 'vue-router';
import { V2Layout } from '@genrs/ui/layouts';

export const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/staff',
    name: 'staff',
    component: V2Layout,
    children: [
      {
        path: '',
        component: () =>
          import('@genossys-hospital/presentation/staff/base/pages/StaffPage.vue'),
      },
    ],
    meta: { public: false },
  },
];

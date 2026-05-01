import type { RouteRecordRaw } from 'vue-router';

export const staffRoutes: RouteRecordRaw[] = [
  {
    path: 'staff',
    name: 'staff',
    component: () =>
      import('@genossys-hospital/presentation/staff/base/pages/StaffPage.vue'),
  },
];

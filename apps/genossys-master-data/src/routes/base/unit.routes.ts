import type { RouteRecordRaw } from 'vue-router';

export const unitRoutes: RouteRecordRaw[] = [
  {
    path: '/unit',
    name: 'unit',
    component: () =>
      import('@genossys-hospital/presentation/unit/base/pages/Unit.vue'),
    meta: { public: false },
  },
];

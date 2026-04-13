import type { RouteRecordRaw } from 'vue-router';

export const unitRoutes: RouteRecordRaw[] = [
  {
    path: '/unit',
    children: [
      {
        path: '',
        component: () => import('@page/unit/Unit.vue'),
      },
    ],
  },
];

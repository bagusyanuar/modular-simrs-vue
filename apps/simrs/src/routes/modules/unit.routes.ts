import type { RouteRecordRaw } from 'vue-router';

export const unitRoutes: RouteRecordRaw[] = [
  {
    path: '/unit',
    children: [
      {
        path: '',
        component: () =>
          import('@genrs/presentation/simrs/base/pages/unit/Unit.vue'),
      },
    ],
  },
];

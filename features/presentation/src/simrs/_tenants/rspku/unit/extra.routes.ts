import type { RouteRecordRaw } from 'vue-router';

/**
 * Extension Point - Unit Module (RS PKU)
 * Menambahkan rute eksklusif yang hanya ada di RS PKU.
 */
export const unitExtraRoutes: RouteRecordRaw[] = [
  {
    path: '/unit/spesial-pku',
    // Menggunakan component Unit yang sudah dicustom oleh user
    component: () => import('./ExtraPage.vue'),
  },
  {
    path: '/unit',
    // Menggunakan component Unit yang sudah dicustom oleh user
    component: () => import('./OverrideBaseUnit.vue'),
  },
];

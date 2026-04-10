import type { RouteRecordRaw } from 'vue-router';

/**
 * Extension Point - Billing Module (RS PKU)
 * Menambahkan rute eksklusif yang hanya ada di RS PKU.
 */
export const billingExtraRoutes: RouteRecordRaw[] = [
  {
    path: '/billing',
    // Menggunakan component Unit yang sudah dicustom oleh user
    component: () => import('../pages/billing/Billing.vue'),
  },
];

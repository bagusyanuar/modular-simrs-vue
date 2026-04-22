import type { RouteRecordRaw } from 'vue-router';

/**
 * Extension Point - BILLING Module (RS-MODERN)
 * Menambahkan rute eksklusif yang hanya ada di tenant ini.
 */
export const billingExtraRoutes: RouteRecordRaw[] = [
  {
    path: '/billing',
    component: () => import('./Billing.vue'),
  },
];

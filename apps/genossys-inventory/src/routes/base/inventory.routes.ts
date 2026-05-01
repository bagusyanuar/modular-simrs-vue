import type { RouteRecordRaw } from 'vue-router';

export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: 'inventory',
    name: 'inventory',
    component: () =>
      import('@genossys-hospital/presentation/inventory/base/pages/InventoryPage.vue'),
  },
];

import type { RouteRecordRaw } from 'vue-router';
import StockPage from '@genossys-hospital/presentation/stock/pages/StockPage.vue';

const stockRoutes: RouteRecordRaw[] = [
  {
    path: 'stock',
    name: 'stock',
    component: StockPage,
    meta: { requiresAuth: true }
  }
];

export default stockRoutes;

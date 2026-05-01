/// <reference types="vite/client" />

declare module 'virtual:tenant-routes' {
  import { RouteRecordRaw } from 'vue-router';
  export const tenantRoutes: RouteRecordRaw[];
  export default tenantRoutes;
}

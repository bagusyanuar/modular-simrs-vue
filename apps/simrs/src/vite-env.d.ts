/// <reference types="vite/client" />

declare module 'virtual:page-registry' {
  import type { RouteRecordRaw } from 'vue-router';
  export const moduleLibrary: Record<string, Array<Record<string, RouteRecordRaw[]>>>;
}

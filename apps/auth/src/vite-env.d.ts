/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TENANT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:page-registry' {
  import type { RouteRecordRaw } from 'vue-router';
  export const moduleLibrary: Record<string, Array<Record<string, RouteRecordRaw[]>>>;
}

// Global Versioning Constants (Injected by vite-plugin-tenant)
declare const __APP_VERSION__: string;
declare const __TENANT_CODE__: string;
declare const __MANIFEST__: any;

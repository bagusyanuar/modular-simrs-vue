/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVER_URL: string;
  readonly VITE_AUTH_SSO_DOMAIN: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_REDIRECT_URI: string;
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

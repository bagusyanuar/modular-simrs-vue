/**
 * Type definitions for Vite environment variables
 */
interface ImportMetaEnv {
  readonly VITE_GLOBAL_API_BASE_URL?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

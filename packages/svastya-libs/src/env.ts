export interface LibsRuntimeConfig {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    config?: LibsRuntimeConfig;
  }
}

/**
 * Mengambil nilai environment secara dinamis.
 * Mengecek window.config terlebih dahulu (runtime injection),
 * kemudian fallback ke import.meta.env (dev/build time).
 */
export function getEnv(key: string, defaultValue = ''): string {
  const runtimeConfig = typeof window !== 'undefined' ? window.config || {} : {};

  // Cast import.meta secara aman agar client package tidak wajib me-load tipe vite/client
  const meta =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as {
          env?: Record<string, string | number | boolean | undefined>;
        })
      : undefined;

  const value = runtimeConfig[key] ?? (meta?.env ? meta.env[key] : undefined);

  return value !== undefined ? String(value) : defaultValue;
}

/**
 * Utility to access environment variables at runtime.
 * Prioritizes window.config (Runtime) over import.meta.env (Build-time).
 */
export function getEnv(key: string, defaultValue = ''): string {
  // @ts-ignore
  const runtimeConfig = window.config || {};
  
  const value = runtimeConfig[key] || import.meta.env[key];
  
  return value !== undefined ? String(value) : defaultValue;
}

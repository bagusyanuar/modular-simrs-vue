export interface RuntimeConfig {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    config?: RuntimeConfig;
  }
}

export function getEnv(key: string, defaultValue = ''): string {
  const runtimeConfig = window.config || {};

  const value = runtimeConfig[key] ?? import.meta.env[key];

  return value !== undefined ? String(value) : defaultValue;
}

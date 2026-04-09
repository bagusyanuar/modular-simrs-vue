import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

/**
 * Default HTTP Client configuration
 */
const defaultConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Create a new Axios instance with standardized interceptors
 */
export function createHttpClient(config: AxiosRequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    ...defaultConfig,
    ...config,
  });

  // Attach shared interceptors
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);

  return instance;
}

/**
 * Shared singleton instance for the entire application
 * Use this for general API calls.
 */
export const http = createHttpClient();

// Export axios types for convenience
export type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

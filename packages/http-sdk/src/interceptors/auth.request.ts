import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import type { HttpHooks } from '../types';

/**
 * Setup request interceptor to inject Authorization header
 */
export function setupAuthRequestInterceptor(
  instance: AxiosInstance, 
  hooks?: HttpHooks
) {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const getToken = hooks?.getToken;
      if (getToken) {
        const token = getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Execute custom onRequest hook if provided
      if (hooks?.onRequest) {
        return await hooks.onRequest(config);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}


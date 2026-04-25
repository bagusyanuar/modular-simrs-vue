import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { AuthInterceptorOptions } from '../types';

/**
 * Setup request interceptor to inject Authorization header
 */
export function setupRequestInterceptor(instance: AxiosInstance, options: AuthInterceptorOptions) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = options.getToken();
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
}

import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import type { HttpHooks } from '../types';

/**
 * Setup request interceptor to inject Authorization header
 */
export function setupAuthRequestInterceptor<BaseResponse = unknown>(
  instance: AxiosInstance, 
  hooks?: HttpHooks<BaseResponse>
) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const getToken = hooks?.getToken;
      if (getToken) {
        const token = getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

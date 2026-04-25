import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { AuthInterceptorOptions } from '../types';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Setup response interceptor to handle 401 and token refresh
 */
export function setupResponseInterceptor(instance: AxiosInstance, options: AuthInterceptorOptions) {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 1. Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // Check if we have a refresh function
        if (!options.refreshToken) {
          if (options.onUnauthorized) options.onUnauthorized(error);
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call the agnostic refresh function provided by the app
          const newToken = await options.refreshToken();

          processQueue(null, newToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          
          if (options.onUnauthorized) {
            options.onUnauthorized(refreshError);
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 2. Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('🚫 Access Forbidden: You do not have permission.');
      }

      return Promise.reject(error);
    }
  );
}

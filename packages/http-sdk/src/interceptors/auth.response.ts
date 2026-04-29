import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { HttpHooks, PendingRequest } from '../types';

/**
 * Setup response interceptor to handle 401 Unauthorized and Token Refresh
 */
export function setupAuthResponseInterceptor<BaseResponse = unknown>(
  instance: AxiosInstance, 
  hooks?: HttpHooks<BaseResponse>
) {
  let isRefreshing = false;
  let failedQueue: PendingRequest[] = [];

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

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
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

        const onRefreshToken = hooks?.onRefreshToken;
        if (!onRefreshToken) {
          if (hooks?.onUnauthorized) hooks.onUnauthorized(error);
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await onRefreshToken();
          processQueue(null, newToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          if (hooks?.onUnauthorized) hooks.onUnauthorized(refreshError as AxiosError);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

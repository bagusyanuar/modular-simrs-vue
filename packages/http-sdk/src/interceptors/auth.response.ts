import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { HttpHooks, PendingRequest } from '../types';
import { HttpError } from '../types';

interface ErrorData {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

// Helper to normalize AxiosError inside the interceptor
const toHttpError = (error: AxiosError) => {
  const data = error.response?.data as ErrorData | undefined;
  const message = data?.message || error.message || 'Unknown Error';
  const status = error.response?.status;
  const code = data?.code || 'UNKNOWN_ERROR';
  return new HttpError(message, status, code, error);
};

/**
 * Setup response interceptor to handle Unauthorized and Token Refresh
 */
export function setupAuthResponseInterceptor(
  instance: AxiosInstance, 
  hooks?: HttpHooks
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
      
      const httpError = toHttpError(error);
      const isTokenExpired = hooks?.shouldRefreshToken 
        ? hooks.shouldRefreshToken(httpError)
        : error.response?.status === 401;

      if (isTokenExpired && !originalRequest._retry) {
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
          if (hooks?.onUnauthorized) hooks.onUnauthorized(httpError);
          return Promise.reject(error); // Keep returning raw error so setupErrorInterceptor catches it later
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
          const refreshHttpError = axios.isAxiosError(refreshError) ? toHttpError(refreshError) : (refreshError as HttpError);
          if (hooks?.onUnauthorized) hooks.onUnauthorized(refreshHttpError);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

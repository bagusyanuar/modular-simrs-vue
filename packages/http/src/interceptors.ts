import type { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { SessionManager } from '@genrs/auth';

/**
 * Handle Auth token injection in requests
 */
export function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const session = SessionManager.get();
      if (session?.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

/**
 * Handle Token Refresh and Global Error Handling
 */
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

export function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 1. Handle 401 Unauthorized
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

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const session = SessionManager.get();
          if (!session?.refreshToken) {
            throw new Error('No refresh token available');
          }

          // Trigger Refresh Call (Request directly to auth server endpoint)
          const { authServerUrl } = SessionManager.config;
          const { data } = await axios.post(`${authServerUrl}/auth/refresh`, {
            refresh_token: session.refreshToken,
          });

          // Save new tokens
          SessionManager.save({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });

          processQueue(null, data.access_token);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          SessionManager.logout();
          
          // Optional: Redirect to login or trigger global event
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
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

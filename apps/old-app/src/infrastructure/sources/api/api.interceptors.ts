import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { AxiosInterceptors } from './api.provider';
import { BrowserStorage, STORAGE_KEYS } from '@/infrastructure/sources/storage';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const mainInterceptors: AxiosInterceptors = {
  onRequest: (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  onRequestError: (error: AxiosError) => Promise.reject(error),
  onResponse: (response: AxiosResponse) => response,
  onResponseError: async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`
        );

        BrowserStorage.set<string>(
          STORAGE_KEYS.ACCESS_TOKEN,
          data.access_token
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }

        // re run failed request
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
};

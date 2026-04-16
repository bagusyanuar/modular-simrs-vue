import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { AxiosInterceptors } from './api.provider';
import { SessionManager } from '@genrs/auth';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const mainInterceptors: AxiosInterceptors = {
  onRequest: (config: InternalAxiosRequestConfig) => {
    // 🔐 Ambil token dari Shared Cookie via SessionManager
    const session = SessionManager.get();
    if (session?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  onRequestError: (error: AxiosError) => Promise.reject(error),
  onResponse: (response: AxiosResponse) => response,
  onResponseError: async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 & Auto Refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log('[Interceptors] 401 detected. Attempting token refresh...');
        const session = SessionManager.get();

        // 🔄 Hit Auth Server for Refresh
        // Menggunakan instance axios baru tanpa interceptors global
        // Pastikan withCredentials true agar cookie HttpOnly terkirim jika ada
        const { data } = await axios.post(
          `${import.meta.env.VITE_GLOBAL_API_BASE_URL}/auth/refresh`,
          { refresh_token: session?.refreshToken }, // Tetap kirim body jika ada
          { withCredentials: true }
        );

        console.log('[Interceptors] Refresh successful.');

        // 💾 Simpan session baru ke Shared Cookie
        SessionManager.save({
          accessToken: data.access_token,
          refreshToken: data.refresh_token || session?.refreshToken,
        });

        // Update Authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }

        // Re-run failed request
        return axios(originalRequest);
      } catch (refreshError: any) {
        // 🚨 Refresh gagal (misal: refresh token expired)
        console.error('[Interceptors] Refresh token failed:', refreshError.response?.data || refreshError.message);

        // Bersihkan session local
        SessionManager.logout();

        // Buang error agar SSOGuard di router bisa mendeteksi session hilang
        // dan melakukan redirect ke SSO Login.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
};

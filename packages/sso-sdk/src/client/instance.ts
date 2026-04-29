import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import type { SSOConfig, TokenResponse } from '../types';

interface RefreshQueueItem {
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}

export class SSOApi {
  public instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: RefreshQueueItem[] = [];

  constructor(config: SSOConfig) {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      withCredentials: true, // Crucial for HTTPOnly Cookies
    });

    this.setupInterceptors(config);
  }

  private setupInterceptors(config: SSOConfig) {
    // Request Interceptor: Nempel token kalau ada (Opsional, tergantung kebutuhan)
    this.instance.interceptors.request.use((conf) => {
      // Logic nempel token bisa ditambahkan di sini oleh Main Class
      return conf;
    });

    // Response Interceptor: Handle 401 & Auto Refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Jika 401 dan bukan sedang retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Antre kalau lagi ada proses refresh yang jalan
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.instance(originalRequest));
                },
                reject: (err: unknown) => reject(err),
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Hit token endpoint untuk refresh (pake cookie refresh_token)
            const tokenUrl = config.endpoints?.token || '/token';
            const { data } = await axios.post(
              `${config.baseUrl}${tokenUrl}`,
              {
                grant_type: 'refresh_token',
                client_id: config.clientId,
              },
              { withCredentials: true }
            );

            const newTokenResponse: TokenResponse = data.data || data;
            const newToken = newTokenResponse.access_token;

            this.onRefreshed(newToken);
            this.isRefreshing = false;

            // Retry request awal
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((subscriber) => subscriber.resolve(token));
    this.refreshSubscribers = [];
  }
}

import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
} from 'axios';
import type { HttpClientConfig } from './types';
import { HttpError } from './types';
import { setupAuthRequestInterceptor } from './interceptors/auth.request';
import { setupAuthResponseInterceptor } from './interceptors/auth.response';

export class HttpClient {
  public instance: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = config;
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    setupAuthRequestInterceptor(this.instance, this.config.hooks);
    setupAuthResponseInterceptor(this.instance, this.config.hooks);
    this.setupErrorInterceptor();
  }

  private setupErrorInterceptor(): void {
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // If it's already an HttpError, just re-throw
        if (error.name === 'HttpError') return Promise.reject(error);

        // Normalize AxiosError to HttpError
        const message = error.response?.data?.message || error.message || 'Unknown Error';
        const status = error.response?.status;
        const code = error.response?.data?.code || 'UNKNOWN_ERROR';

        const httpError = new HttpError(message, status, code, error);
        
        // Trigger hook if provided
        if (this.config.hooks?.onError) {
          this.config.hooks.onError(httpError);
        }

        return Promise.reject(httpError);
      }
    );
  }

  /**
   * Main request method for any custom axios configuration
   */
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }

  /**
   * Standardized GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * Standardized POST request
   */
  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Standardized PUT request
   */
  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Standardized DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

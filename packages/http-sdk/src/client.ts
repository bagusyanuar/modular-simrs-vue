import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig,
  type AxiosError 
} from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

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
      (error: AxiosError) => {
        // If it's already an HttpError, just re-throw
        if (error.name === 'HttpError') return Promise.reject(error);

        // Normalize AxiosError to HttpError safely
        const data = error.response?.data as
          | { message?: string; code?: string }
          | undefined;
        const message = data?.message || error.message || 'Unknown Error';
        const status = error.response?.status;
        const code = data?.code || 'UNKNOWN_ERROR';

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

  public async getRaw<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.get<T>(url, config);
  }

  /**
   * Standardized POST request
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async postRaw<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return await this.instance.post<T>(url, data, config);
  }

  /**
   * Standardized PUT request
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async putRaw<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return await this.instance.put<T>(url, data, config);
  }

  /**
   * Standardized PATCH request
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async patchRaw<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return await this.instance.patch<T>(url, data, config);
  }

  /**
   * Standardized DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async deleteRaw<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.delete<T>(url, config);
  }
}

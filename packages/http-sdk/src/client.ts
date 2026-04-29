import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
} from 'axios';
import type { HttpClientConfig } from './types';
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

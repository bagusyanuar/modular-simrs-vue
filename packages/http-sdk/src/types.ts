import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

/**
 * Configuration for HttpClient hooks
 */
export interface HttpHooks {
  /** Get access token from state (Pinia/Cookie/etc) */
  getToken?: () => string | null | undefined;
  
  /** Logic to refresh token, should return new token */
  onRefreshToken?: () => Promise<string>;
  
  /** Called when 401 occurs and refresh fails */
  onUnauthorized?: (error: AxiosError) => void;

  /** Custom handler for non-2xx responses or business errors */
  onError?: (error: HttpError) => void;
}

/**
 * Main HttpClient Configuration
 */
export interface HttpClientConfig extends AxiosRequestConfig {
  hooks?: HttpHooks;
}

/**
 * Standardized Http Error for Domain Layer
 */
export class HttpError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: string,
    public originalError?: AxiosError | AxiosResponse | unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Queue Item for pending requests during refresh
 */
export interface PendingRequest {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError | null) => void;
}

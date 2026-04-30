import type { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Configuration for HttpClient hooks
 */
export interface HttpHooks {
  /** Get access token from state (Pinia/Cookie/etc) */
  getToken?: () => string | null | undefined;
  
  /** Logic to refresh token, should return new token */
  onRefreshToken?: () => Promise<string>;
  
  /** Called when token refresh fails or is not configured */
  onUnauthorized?: (error: HttpError) => void;

  /** Custom handler for non-2xx responses or business errors */
  onError?: (error: HttpError) => void;

  /** Hook to modify request config globally before sending */
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

  /** Custom logic to determine if token should be refreshed (defaults to status === 401) */
  shouldRefreshToken?: (error: HttpError) => boolean;
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

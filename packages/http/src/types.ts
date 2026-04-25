/**
 * Configuration options for HTTP Auth Interceptors
 */
export interface AuthInterceptorOptions {
  /**
   * Function to retrieve the current access token (from Pinia/Cookie/Storage)
   */
  getToken: () => string | null | undefined;

  /**
   * Function to handle token refresh logic
   * Should return the new access token string
   */
  refreshToken?: () => Promise<string>;

  /**
   * Callback when authentication fails completely (refresh fails or no token)
   */
  onUnauthorized?: (error: any) => void;
}

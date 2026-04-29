import { HttpClient, HttpError } from '@genossys-hospital/http-sdk';
import { getEnv } from '@genrs/utils';
import { ssoClient } from '../auth/base/auth.provider';

/**
 * Global HTTP Client Instance
 * Configured with SSO SDK hooks for automatic token management.
 */
export const api = new HttpClient({
  baseURL: getEnv('VITE_API_URL') || getEnv('VITE_GLOBAL_API_BASE_URL'),
  timeout: 15000,
  hooks: {
    getToken: () => ssoClient.getAccessToken(),
    onUnauthorized: () => {
      ssoClient.logout();
      window.location.href = '/login';
    },
  },
});

/**
 * Standard Response Unwrapper for Genossys Hospital API
 * Automatically unwraps { success, data, message } structure.
 */
api.instance.interceptors.response.use((response) => {
  const { data } = response;

  // If response matches Genossys standard envelope, unwrap it
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    if (data.success) {
      return { ...response, data: data.data };
    }
  }

  return response;
});

// Re-export HttpError for easier use in other layers
export { HttpError };

import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from '@genrs/http';
import { getEnv } from '@genrs/utils';

/**
 * Shared API Client for Master Data App
 */
const api = axios.create({
  baseURL: getEnv('VITE_API_BASE_URL'),
});

// Configure Agnostic Interceptors
const authOptions = {
  // Get token directly from SDK storage for now (or Pinia later)
  getToken: () => {
    // We can use a simple helper or read from cookie
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
  },

  // Refresh token logic
  refreshToken: async () => {
    // In a real app, you'd call ssoClient.refreshToken() here
    // For now, we'll just throw error to trigger logout/redirect
    throw new Error('Refresh token not implemented yet in this shell');
  },

  onUnauthorized: () => {
    console.warn('⚠️ Session expired. Reloading to trigger SSO login...');
    window.location.reload();
  },
};

setupRequestInterceptor(api, authOptions);
setupResponseInterceptor(api, authOptions);

export default api;

import { SSOClient } from '@neurovi-hospital/sdk-sso';
import { getEnv } from '@genrs/utils';

/**
 * Singleton instance of SSOClient to be used across the application.
 * Centralizes the SSO configuration and state.
 */
export const ssoProvider = new SSOClient({
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: getEnv('VITE_SSO_CLIENT_ID'),
  redirectUri: window.location.origin + '/callback',
  endpoints: {
    logout: '/logout',
  },
});

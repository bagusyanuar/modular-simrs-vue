import { createSSOClient } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

export const ssoClient = createSSOClient({
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: '', // Portal SSO nggak butuh clientId sendiri
  redirectUri: '', 
});

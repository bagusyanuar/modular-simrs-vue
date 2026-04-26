import { createSSOClient } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

export const ssoClient = createSSOClient({
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: '', // Portal SSO nggak butuh clientId sendiri
  redirectUri: '',
  endpoints: {
    authorize: '/authorize', // GET /authorize untuk check session (PKCE)
    login: '/authorize', // POST /authorize untuk submit form login (Otentikasi via API)
    token: '/token', // POST /token untuk exchange code & refresh token
  },
});

import { CookieStorage } from './storage';

/**
 * Session Interface matching Backend Payload
 */
export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Session Configuration Interface
 */
export interface SessionConfig {
  domain: string;
  secure: boolean;
  expires: number;
  clientId: string;
  redirectUri: string;
  authServerUrl: string;
}

/**
 * SessionManager logic
 * Handles syncing tokens from Backend Body to Domain Cookies for SSO
 */
export const SessionManager = {
  // Default values
  config: {
    domain: import.meta.env.VITE_AUTH_SSO_DOMAIN || '.neurovi-simulation.test',
    secure: false,
    expires: 7,
    clientId: '',
    redirectUri: '',
    authServerUrl: import.meta.env.VITE_AUTH_SERVER_URL || 'http://neurovi-simulation.test:3000',
  } as SessionConfig,

  /**
   * Update configuration (e.g. from app environment)
   */
  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  },

  /**
   * Saves tokens received from Backend into shared domain cookies
   */
  save(session: AuthSession): void {
    const { domain, secure, expires } = this.config;
    
    if (session.accessToken) {
      CookieStorage.set('access_token', session.accessToken, { 
        domain, 
        secure, 
        expires,
        path: '/' 
      });
    }
    
    if (session.refreshToken) {
      CookieStorage.set('refresh_token', session.refreshToken, { 
        domain, 
        secure, 
        expires,
        path: '/' 
      });
    }
  },

  /**
   * Retrieves current session from shared cookies
   * Note: refresh_token mungkin tidak terbaca jika di-set sebagai HttpOnly oleh backend
   */
  get(): AuthSession | null {
    const accessToken = CookieStorage.get('access_token');
    if (!accessToken) return null;

    const refreshToken = CookieStorage.get('refresh_token') ?? undefined;
    return { accessToken, refreshToken };
  },

  /**
   * Clears session from shared cookies (Logout)
   */
  logout(): void {
    const { domain } = this.config;
    CookieStorage.remove('access_token', { domain, path: '/' });
    CookieStorage.remove('refresh_token', { domain, path: '/' });
  },

  /**
   * Check if user is authenticated (simple check)
   */
  isAuthenticated(): boolean {
    return !!CookieStorage.get('access_token');
  }
};

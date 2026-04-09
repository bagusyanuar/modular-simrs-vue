import { CookieStorage } from './storage';

/**
 * Session Interface matching Backend Payload
 */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
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
    domain: '.neurovi-simulation.test',
    secure: false,
    expires: 7,
    clientId: '',
    redirectUri: '',
    authServerUrl: 'http://auth.neurovi-simulation.test:3000',
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
    
    CookieStorage.set('access_token', session.accessToken, { 
      domain, 
      secure, 
      expires,
      path: '/' 
    });
    
    CookieStorage.set('refresh_token', session.refreshToken, { 
      domain, 
      secure, 
      expires,
      path: '/' 
    });
  },

  /**
   * Retrieves current session from shared cookies
   */
  get(): AuthSession | null {
    const accessToken = CookieStorage.get('access_token');
    const refreshToken = CookieStorage.get('refresh_token');

    if (!accessToken || !refreshToken) return null;

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

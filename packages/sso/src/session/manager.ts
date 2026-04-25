import { CookieStorage } from './storage';

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
}

export interface SessionConfig {
  domain: string;
  secure: boolean;
  expires: number;
}

/**
 * Internal Session Manager for SSO Package
 * Independent from @genrs/auth
 */
export const SSOSessionManager = {
  config: {
    domain: '',
    secure: false,
    expires: 7,
  } as SessionConfig,

  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  },

  save(session: AuthSession): void {
    const { domain, secure, expires } = this.config;

    if (session.accessToken) {
      CookieStorage.set('access_token', session.accessToken, {
        domain,
        secure,
        expires,
        path: '/',
      });
    }

    if (session.refreshToken) {
      CookieStorage.set('refresh_token', session.refreshToken, {
        domain,
        secure,
        expires,
        path: '/',
      });
    }
  },

  get(): AuthSession | null {
    const accessToken = CookieStorage.get('access_token');
    if (!accessToken) return null;

    const refreshToken = CookieStorage.get('refresh_token') ?? undefined;
    return { accessToken, refreshToken };
  },

  logout(): void {
    const { domain } = this.config;
    CookieStorage.remove('access_token', { domain, path: '/' });
    CookieStorage.remove('refresh_token', { domain, path: '/' });
  },

  isAuthenticated(): boolean {
    return !!CookieStorage.get('access_token');
  },
};

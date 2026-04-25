export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
}

export interface SessionConfig {
  domain: string;
  secure: boolean;
  expires: number;
}

const STORAGE_KEY_ACCESS = 'sso_access_token';
const STORAGE_KEY_REFRESH = 'sso_refresh_token';

/**
 * Internal Session Manager for SSO Package
 * Uses localStorage for reliability in HTTP dev environments.
 * Cookie cross-domain sharing requires HTTPS+SameSite=None.
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
    console.log('[SSOSessionManager] Saving session...', { hasAccess: !!session.accessToken, hasRefresh: !!session.refreshToken });
    if (session.accessToken) {
      localStorage.setItem(STORAGE_KEY_ACCESS, session.accessToken);
    }
    if (session.refreshToken) {
      localStorage.setItem(STORAGE_KEY_REFRESH, session.refreshToken);
    }
    console.log('[SSOSessionManager] Session saved ✅');
  },

  get(): AuthSession | null {
    const accessToken = localStorage.getItem(STORAGE_KEY_ACCESS);
    if (!accessToken) return null;
    const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH) ?? undefined;
    return { accessToken, refreshToken };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_ACCESS);
    localStorage.removeItem(STORAGE_KEY_REFRESH);
  },

  isAuthenticated(): boolean {
    const result = !!localStorage.getItem(STORAGE_KEY_ACCESS);
    console.log('[SSOSessionManager] isAuthenticated:', result);
    return result;
  },
};

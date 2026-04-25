import { CookieStorage } from './storage';

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
}

export interface SessionConfig {
  domain: string;
  secure: boolean;
  expires: number;
  /** Opsi penyimpanan persistent: 'cookie' (default, support cross-domain) atau 'localstorage' */
  persistentStorage?: 'cookie' | 'localstorage';
  /** Hook untuk menyimpan Access Token ke State Management eksternal (misal Pinia) */
  onSaveToken?: (token: string) => void;
  /** Hook untuk mengambil Access Token dari State Management eksternal */
  onGetToken?: () => string | null;
  /** Hook untuk menghapus Access Token dari State Management eksternal */
  onClearToken?: () => void;
}

const STORAGE_KEY_REFRESH = 'sso_refresh_token';

// 🧠 Internal fallback storage (In-memory)
let _accessToken: string | null = null;

/**
 * Internal Session Manager for SSO Package
 * Implementation: Pluggable storage with hooks and configurable persistence
 */
export const SSOSessionManager = {
  config: {
    domain: '',
    secure: false,
    expires: 7,
    persistentStorage: 'cookie',
  } as SessionConfig,

  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  },

  save(session: AuthSession): void {
    // 1. Handle Access Token (Hooks or Memory)
    if (this.config.onSaveToken) {
      this.config.onSaveToken(session.accessToken);
    } else {
      _accessToken = session.accessToken;
    }

    // 2. Handle Refresh Token (Persistent)
    if (session.refreshToken) {
      if (this.config.persistentStorage === 'localstorage') {
        localStorage.setItem(STORAGE_KEY_REFRESH, session.refreshToken);
      } else {
        CookieStorage.set(STORAGE_KEY_REFRESH, session.refreshToken, {
          domain: this.config.domain,
          secure: this.config.secure,
          expires: this.config.expires,
          sameSite: 'Lax',
        });
      }
    }
  },

  get(): AuthSession | null {
    // 1. Get Access Token
    const accessToken = this.config.onGetToken 
      ? this.config.onGetToken() 
      : _accessToken;

    // 2. Get Refresh Token
    const refreshToken = this.config.persistentStorage === 'localstorage'
      ? localStorage.getItem(STORAGE_KEY_REFRESH)
      : CookieStorage.get(STORAGE_KEY_REFRESH);

    if (!accessToken && !refreshToken) return null;

    return { 
      accessToken: accessToken || '', 
      refreshToken: refreshToken ?? undefined 
    };
  },

  logout(): void {
    // 1. Clear Access Token
    if (this.config.onClearToken) {
      this.config.onClearToken();
    } else {
      _accessToken = null;
    }

    // 2. Clear Refresh Token
    if (this.config.persistentStorage === 'localstorage') {
      localStorage.removeItem(STORAGE_KEY_REFRESH);
    } else {
      CookieStorage.remove(STORAGE_KEY_REFRESH, {
        domain: this.config.domain,
        secure: this.config.secure,
      });
    }
  },

  /**
   * Check if we have an active access token
   */
  isAuthenticated(): boolean {
    const token = this.config.onGetToken 
      ? this.config.onGetToken() 
      : _accessToken;
    return !!token;
  },

  /**
   * Check if we have a persisted session (refresh token)
   */
  hasPersistedSession(): boolean {
    const token = this.config.persistentStorage === 'localstorage'
      ? localStorage.getItem(STORAGE_KEY_REFRESH)
      : CookieStorage.get(STORAGE_KEY_REFRESH);
    return !!token;
  },
};

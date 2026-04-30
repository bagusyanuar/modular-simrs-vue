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
  /** Custom key untuk menyimpan refresh token (Default: sso_refresh_token) */
  refreshKey?: string;
  /** Hook untuk menangani navigasi antar domain (misal: untuk animasi) */
  onRedirect?: (url: string) => void | Promise<void>;
}

let _refreshKey = 'refresh_token';

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
    if (config.refreshKey) {
      _refreshKey = config.refreshKey;
    }
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
        localStorage.setItem(_refreshKey, session.refreshToken);
      } else {
        CookieStorage.set(_refreshKey, session.refreshToken, {
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
    const refreshToken =
      this.config.persistentStorage === 'localstorage'
        ? localStorage.getItem(_refreshKey)
        : CookieStorage.get(_refreshKey);

    if (!accessToken && !refreshToken) return null;

    return {
      accessToken: accessToken || '',
      refreshToken: refreshToken ?? undefined,
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
      localStorage.removeItem(_refreshKey);
    } else {
      CookieStorage.remove(_refreshKey, {
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
    const token =
      this.config.persistentStorage === 'localstorage'
        ? localStorage.getItem(_refreshKey)
        : CookieStorage.get(_refreshKey);
    return !!token;
  },
  /**
   * Helper untuk redirect antar domain dengan hook animasi jika tersedia
   */
  async redirect(url: string): Promise<void> {
    if (this.config.onRedirect) {
      await this.config.onRedirect(url);
    } else {
      window.location.href = url;
    }
  },
};

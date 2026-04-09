/**
 * Auth Storage Utilities
 * Handles Cookies (for SSO) and SessionStorage (for PKCE)
 */

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: number | Date; // number of days or Date object
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

/**
 * Native Cookie Storage Helper (Zero Dependency)
 */
export const CookieStorage = {
  set(name: string, value: string, options: CookieOptions = {}) {
    if (typeof document === 'undefined') return;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    const { domain, path = '/', expires, secure, sameSite = 'Lax' } = options;

    if (expires) {
      if (typeof expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${expires.toUTCString()}`;
      }
    }

    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (sameSite) cookieString += `; samesite=${sameSite}`;
    if (secure) cookieString += '; secure';

    document.cookie = cookieString;
  },

  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameLenPlus = encodeURIComponent(name).length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => cookie.substring(0, nameLenPlus) === `${encodeURIComponent(name)}=`)
        .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] ?? null
    );
  },

  remove(name: string, options: CookieOptions = {}) {
    this.set(name, '', { ...options, expires: -1 });
  },
};

/**
 * Session Storage Helper for PKCE Artifacts
 */
export const PKCEStorage = {
  setVerifier(verifier: string) {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem('pkce_verifier', verifier);
  },
  getVerifier(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem('pkce_verifier');
  },
  clearVerifier() {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem('pkce_verifier');
  },
  setState(state: string) {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem('pkce_state', state);
  },
  getState(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem('pkce_state');
  },
  clearState() {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem('pkce_state');
  },
};

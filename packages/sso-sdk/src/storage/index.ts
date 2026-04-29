export interface AuthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Default storage implementation using localStorage for tokens
 * and sessionStorage for transient PKCE data.
 */
export class DefaultAuthStorage implements AuthStorage {
  getItem(key: string): string | null {
    // PKCE data should be in session storage
    if (key.startsWith('pkce_')) {
      return sessionStorage.getItem(key);
    }
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (key.startsWith('pkce_')) {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
}

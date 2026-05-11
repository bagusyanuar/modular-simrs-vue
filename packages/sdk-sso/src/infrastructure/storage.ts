import type { AuthSession } from '../types';

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class SSOStorage {
  private prefix = 'neurovi_sso_';

  constructor(private storage: Storage = localStorage) {}

  public saveSession(session: AuthSession): void {
    this.storage.setItem(this.prefix + 'session', JSON.stringify(session));
  }

  public getSession(): AuthSession | null {
    try {
      const raw = this.storage.getItem(this.prefix + 'session');
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (!this.isValidSession(parsed)) {
        this.removeSession();
        return null;
      }

      return parsed;
    } catch {
      this.removeSession();
      return null;
    }
  }

  public removeSession(): void {
    this.storage.removeItem(this.prefix + 'session');
  }

  public savePKCE(verifier: string, state?: string): void {
    this.storage.setItem(this.prefix + 'pkce_verifier', verifier);
    if (state) {
      this.storage.setItem(this.prefix + 'pkce_state', state);
    }
  }

  public getPKCE(): { verifier: string | null; state: string | null } {
    return {
      verifier: this.storage.getItem(this.prefix + 'pkce_verifier'),
      state: this.storage.getItem(this.prefix + 'pkce_state'),
    };
  }

  public clearPKCE(): void {
    this.storage.removeItem(this.prefix + 'pkce_verifier');
    this.storage.removeItem(this.prefix + 'pkce_state');
  }

  /**
   * Type guard to validate parsed session data shape
   */
  private isValidSession(data: unknown): data is AuthSession {
    if (!data || typeof data !== 'object') return false;
    const record = data as Record<string, unknown>;
    return (
      typeof record['accessToken'] === 'string' &&
      typeof record['tokenType'] === 'string' &&
      typeof record['expiresIn'] === 'number' &&
      typeof record['expiresAt'] === 'number'
    );
  }
}

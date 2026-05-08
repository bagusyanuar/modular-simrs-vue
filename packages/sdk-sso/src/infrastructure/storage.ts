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
    const session = this.storage.getItem(this.prefix + 'session');
    return session ? JSON.parse(session) : null;
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
}

import type {
  SSOConfig,
  AuthSession,
  AuthorizeParams,
  DirectLoginParams,
} from '../types';
import { SSOHttp } from '../infrastructure/http';
import { SSOStorage } from '../infrastructure/storage';
import { AuthService } from '../services/auth-service';

export class SSOClient {
  private http: SSOHttp;
  private storage: SSOStorage;
  private auth: AuthService;

  constructor(config: SSOConfig) {
    this.http = new SSOHttp(config.baseUrl);
    this.storage = new SSOStorage();
    this.auth = new AuthService(config, this.http, this.storage);
  }

  public authorize(params?: AuthorizeParams): Promise<string> {
    return this.auth.createAuthorizeUrl(params);
  }

  public callback(code: string, state?: string): Promise<AuthSession> {
    return this.auth.handleCallback(code, state);
  }

  public login(params: DirectLoginParams): Promise<AuthSession> {
    return this.auth.loginWithCredentials(params);
  }

  public silentLogin(): Promise<string | null> {
    return this.auth.checkSilentLogin();
  }

  public getSession(): AuthSession | null {
    return this.storage.getSession();
  }

  public isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;
    return Date.now() < session.expiresAt;
  }

  public logout(): void {
    this.storage.removeSession();
    this.storage.clearPKCE();
  }
}

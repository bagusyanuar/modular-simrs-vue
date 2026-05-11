import type {
  SSOConfig,
  AuthSession,
  AuthorizeParams,
  DirectLoginParams,
} from '../types';
import { SSOHttp } from '../infrastructure/http';
import { SSOStorage } from '../infrastructure/storage';
import { AuthService } from '../services/auth-service';

/** Buffer in ms before actual expiry to consider session expired (30 seconds) */
const EXPIRY_BUFFER_MS = 30_000;

export class SSOClient {
  private http: SSOHttp;
  private storage: SSOStorage;
  private auth: AuthService;
  private config: SSOConfig;

  constructor(config: SSOConfig) {
    this.config = config;
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

  public refreshToken(token?: string): Promise<AuthSession | null> {
    return this.auth.refreshToken(token);
  }

  public getSession(): AuthSession | null {
    return this.storage.getSession();
  }

  /**
   * Checks if the current session is valid.
   * Uses a 30-second buffer before actual expiry to account for clock drift
   * and network latency during token refresh.
   */
  public isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;
    return Date.now() < session.expiresAt - EXPIRY_BUFFER_MS;
  }

  /**
   * Logout: clears local session and optionally hits server-side logout endpoint.
   * Supports post_logout_redirect_uri for OIDC-compliant flows.
   */
  public async logout(options?: {
    serverLogout?: boolean;
    postLogoutRedirectUri?: string;
  }): Promise<void> {
    const session = this.getSession();

    // Always clear local state first
    this.storage.removeSession();
    this.storage.clearPKCE();

    // Server-side logout if requested and endpoint is configured
    if (options?.serverLogout && this.config.endpoints?.logout) {
      try {
        await this.http.client.post(this.config.endpoints.logout, {
          ...(session?.refreshToken
            ? { refresh_token: session.refreshToken }
            : {}),
          client_id: this.config.clientId,
        });
      } catch {
        // Server logout is best-effort; local state is already cleared
        console.warn('[SSOSDK] Server-side logout failed. Local session cleared.');
      }
    }

    // Redirect after logout if URI provided
    if (options?.postLogoutRedirectUri) {
      window.location.href = options.postLogoutRedirectUri;
    }
  }
}

import type { SSOConfig, TokenResponse, AuthSession } from '../types';
import { createPKCEPair } from '../core/pkce';
import { type AuthStorage, DefaultAuthStorage } from '../storage';
import { SSOApi } from './instance';
import { CookieHelper } from '../storage/cookie';

/**
 * Main SSO Client for Genossys Hospital (PKCE Flow)
 */
export class SSOClient {
  private config: SSOConfig;
  private storage: AuthStorage;
  private api: SSOApi;
  private _accessToken: string | null = null;
  private _expiresAt: number | null = null;

  constructor(config: SSOConfig, storage?: AuthStorage) {
    this.config = config;
    this.storage = storage || new DefaultAuthStorage();
    this.api = new SSOApi(config);

    this.loadSession();
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(config: Partial<SSOConfig>): void {
    this.config = { ...this.config, ...config };
    // Re-init API if baseUrl changed
    if (config.baseUrl) {
      this.api = new SSOApi(this.config);
    }
  }

  public getStorageKeys() {
    return this.keys;
  }

  private get keys() {
    return {
      accessToken: this.config.storageKeys?.accessToken || 'sso_access_token',
      expiresAt: this.config.storageKeys?.expiresAt || 'sso_expires_at',
      pkceVerifier: this.config.storageKeys?.pkceVerifier || 'pkce_verifier',
      pkceState: this.config.storageKeys?.pkceState || 'pkce_state',
    };
  }

  public async login(): Promise<void> {
    const { verifier, challenge, state } = await createPKCEPair();

    this.storage.setItem(this.keys.pkceVerifier, verifier);
    this.storage.setItem(this.keys.pkceState, state);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      code_challenge: challenge,
      state: state,
      response_type: 'code',
    });

    if (!this.config.portalUrl) {
      throw new Error('portalUrl is required for login redirection');
    }

    window.location.href = `${this.config.portalUrl}?${params.toString()}`;
  }

  /**
   * Manual Login via AJAX (Email & Password)
   */
  public async authorizeManual(credentials: {
    email: string;
    password: string;
  }): Promise<{ code: string; state: string }> {
    const { verifier, challenge, state } = await createPKCEPair();

    this.storage.setItem(this.keys.pkceVerifier, verifier);
    this.storage.setItem(this.keys.pkceState, state);

    const authorizeUrl = this.config.endpoints?.authorize || '/authorize';
    const { data } = await this.api.instance.post(authorizeUrl, {
      ...credentials,
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      code_challenge: challenge,
      state: state,
    });

    const responseData = data.data || data;
    const code = responseData.code;
    const returnedState = responseData.state;

    if (!code) throw new Error('Failed to get authorization code');

    // Validate state from BE
    if (returnedState && returnedState !== state) {
      throw new Error('Invalid OAuth2 state returned from server');
    }

    return { code, state: returnedState || state };
  }

  /**
   * Authorize with explicit OAuth2 parameters (Used by SSO Portal)
   */
  public async authorize(params: {
    email: string;
    password: string;
    clientId: string;
    redirectUri: string;
    state: string;
    codeChallenge: string;
  }): Promise<{ code: string; state: string }> {
    const authorizeUrl = this.config.endpoints?.authorize || '/authorize';
    const { data } = await this.api.instance.post(authorizeUrl, {
      email: params.email,
      password: params.password,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      state: params.state,
      code_challenge: params.codeChallenge,
    });

    const responseData = data.data || data;
    return {
      code: responseData.code,
      state: responseData.state || params.state,
    };
  }

  public async handleCallback(
    code: string,
    state: string
  ): Promise<AuthSession> {
    const storedVerifier = this.storage.getItem(this.keys.pkceVerifier);
    const storedState = this.storage.getItem(this.keys.pkceState);

    if (!storedVerifier || !storedState || state !== storedState) {
      throw new Error('Invalid OAuth2 state or verifier missing');
    }

    try {
      const tokenUrl = this.config.endpoints?.token || '/token';
      const { data } = await this.api.instance.post(tokenUrl, {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code,
        code_verifier: storedVerifier,
        redirect_uri: this.config.redirectUri,
      });

      const response: TokenResponse = data.data || data;
      const session = this.saveSession(response);
      this.clearPKCE();

      return session;
    } catch (error) {
      this.clearPKCE();
      throw error;
    }
  }

  public async checkSilentLogin(): Promise<string | null> {
    try {
      const { verifier, challenge, state } = await createPKCEPair();
      this.storage.setItem(this.keys.pkceVerifier, verifier);
      this.storage.setItem(this.keys.pkceState, state);

      const authorizeUrl = this.config.endpoints?.authorize || '/authorize';
      const { data } = await this.api.instance.get(authorizeUrl, {
        headers: {
          Accept: 'application/json',
        },
        params: {
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          code_challenge: challenge,
          state: state,
          response_type: 'code',
          prompt: 'none',
        },
        skipAuth: true,
      });

      const responseData = data.data || data;
      const code = responseData.code;
      const returnedState = responseData.state;

      // Validate state if returned by BE
      if (code && returnedState && returnedState !== state) {
        this.clearPKCE();
        return null;
      }

      return code || null;
    } catch {
      this.clearPKCE();
      return null;
    }
  }

  /**
   * Manually trigger a token refresh using the HTTPOnly refresh_token cookie
   */
  public async refreshAccessToken(): Promise<AuthSession | null> {
    try {
      const tokenUrl = this.config.endpoints?.token || '/token';
      const { data } = await this.api.instance.post(
        tokenUrl,
        {
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
        },
        { skipAuth: true }
      );

      const response: TokenResponse = data.data || data;
      const session = this.saveSession(response);
      return session;
    } catch {
      return null;
    }
  }


  public logout(): void {
    this._accessToken = null;
    this._expiresAt = null;

    if (this.config.onClearToken) {
      this.config.onClearToken();
    }

    // Clear persistent
    this.storage.removeItem(this.keys.accessToken);
    this.storage.removeItem(this.keys.expiresAt);
    CookieHelper.remove(this.keys.accessToken);
  }

  public getAccessToken(): string | null {
    if (this.config.onGetToken) {
      return this.config.onGetToken();
    }

    if (this._accessToken && this._expiresAt && this._expiresAt > Date.now()) {
      return this._accessToken;
    }

    return null;
  }

  public getHttpClient() {
    return this.api.instance;
  }

  private saveSession(response: TokenResponse): AuthSession {
    const expiresAt = Date.now() + response.expires_in * 1000;

    if (this.config.onSaveToken) {
      this.config.onSaveToken(response.access_token);
    }

    this._accessToken = response.access_token;
    this._expiresAt = expiresAt;

    if (this.config.persistence === 'localstorage') {
      this.storage.setItem(this.keys.accessToken, response.access_token);
      this.storage.setItem(this.keys.expiresAt, expiresAt.toString());
    } else if (this.config.persistence === 'cookie') {
      const days = this.config.cookieExpires || 7;
      CookieHelper.set(this.keys.accessToken, response.access_token, days);
      this.storage.setItem(this.keys.expiresAt, expiresAt.toString());
    }

    return {
      accessToken: response.access_token,
      expiresAt: expiresAt,
    };
  }

  private loadSession(): void {
    if (this.config.onGetToken) return;

    let token: string | null = null;
    const expiresAtStr: string | null = this.storage.getItem(
      this.keys.expiresAt
    );

    if (this.config.persistence === 'localstorage') {
      token = this.storage.getItem(this.keys.accessToken);
    } else if (this.config.persistence === 'cookie') {
      token = CookieHelper.get(this.keys.accessToken);
    }

    if (token && expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      if (expiresAt > Date.now()) {
        this._accessToken = token;
        this._expiresAt = expiresAt;
      }
    }
  }

  private clearPKCE(): void {
    this.storage.removeItem(this.keys.pkceVerifier);
    this.storage.removeItem(this.keys.pkceState);
  }
}

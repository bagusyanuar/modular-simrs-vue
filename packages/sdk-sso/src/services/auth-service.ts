import type {
  SSOConfig,
  AuthSession,
  TokenResponse,
  AuthorizeParams,
  AuthorizeResponse,
  DirectLoginParams,
} from '../types';
import { PKCEHelper } from '../utils/pkce';
import {
  PKCEError,
  StateMismatchError,
  TokenExchangeError,
  AuthorizeError,
} from '../errors';
import type { SSOHttp } from '../infrastructure/http';
import type { SSOStorage } from '../infrastructure/storage';

/**
 * Unwraps backend responses that may or may not be wrapped in { data: T }
 * Determines the actual payload regardless of backend envelope pattern
 */
function unwrapResponse<T>(raw: T | { data: T }): T {
  const obj = raw as Record<string, unknown>;
  if (
    obj &&
    typeof obj === 'object' &&
    'data' in obj &&
    typeof obj.data === 'object' &&
    obj.data !== null &&
    !('access_token' in obj) &&
    !('code' in obj)
  ) {
    return obj.data as T;
  }
  return raw as T;
}

export class AuthService {
  constructor(
    private config: SSOConfig,
    private http: SSOHttp,
    private storage: SSOStorage
  ) {}

  public async createAuthorizeUrl(
    params: AuthorizeParams = {}
  ): Promise<string> {
    try {
      const { codeVerifier, codeChallenge } = await PKCEHelper.createPair();
      const state = params.state || PKCEHelper.generateVerifier(16);

      this.storage.savePKCE(codeVerifier, state);

      const url = new URL(
        this.config.endpoints?.authorize || '/authorize',
        this.config.baseUrl
      );
      const queryParams: Record<string, string> = {
        response_type: 'code',
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
        ...(this.config.scope ? { scope: this.config.scope } : {}),
        ...params,
      };

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });

      return url.toString();
    } catch (error) {
      throw new AuthorizeError('Failed to create authorize URL', error);
    }
  }

  public async handleCallback(
    code: string,
    state?: string
  ): Promise<AuthSession> {
    const { verifier, state: storedState } = this.storage.getPKCE();

    if (!verifier) {
      throw new PKCEError('PKCE verifier not found. Cannot exchange token.');
    }

    if (storedState && state && storedState !== state) {
      this.storage.clearPKCE();
      throw new StateMismatchError();
    }

    try {
      const data = await this.http.client.post<
        TokenResponse | { data: TokenResponse }
      >(
        this.config.endpoints?.token || '/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          code,
          code_verifier: verifier,
          redirect_uri: this.config.redirectUri,
        })
      );

      const tokenResponse = unwrapResponse(data);
      const session = this.mapTokenResponse(tokenResponse);
      this.storage.saveSession(session);
      this.storage.clearPKCE();
      return session;
    } catch (error) {
      this.storage.clearPKCE();
      if (error instanceof TokenExchangeError) throw error;
      throw new TokenExchangeError('Token exchange failed', error);
    }
  }

  public async loginWithCredentials(
    params: DirectLoginParams
  ): Promise<AuthSession> {
    const { codeVerifier, codeChallenge } = await PKCEHelper.createPair();
    const state = PKCEHelper.generateVerifier(16);

    const authRes = await this.http.client.post<
      AuthorizeResponse | { data: AuthorizeResponse }
    >(this.config.endpoints?.authorize || '/authorize', {
      ...params,
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      response_type: 'code',
      state,
    });

    const authData = unwrapResponse(authRes);

    try {
      const tokenRes = await this.http.client.post<
        TokenResponse | { data: TokenResponse }
      >(
        this.config.endpoints?.token || '/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          code: authData.code,
          code_verifier: codeVerifier,
          redirect_uri: this.config.redirectUri,
        })
      );

      const tokenData = unwrapResponse(tokenRes);
      const session = this.mapTokenResponse(tokenData);
      this.storage.saveSession(session);
      return session;
    } catch (error) {
      throw new TokenExchangeError('Direct login token exchange failed', error);
    }
  }

  public async checkSilentLogin(): Promise<string | null> {
    const { codeVerifier, codeChallenge } = await PKCEHelper.createPair();
    const state = PKCEHelper.generateVerifier(16);

    try {
      const data = await this.http.client.get<
        AuthorizeResponse | { data: AuthorizeResponse }
      >(this.config.endpoints?.authorize || '/authorize', {
        params: {
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          response_type: 'code',
          prompt: 'none',
          state,
        },
        headers: { Accept: 'application/json' },
        skipAuth: true,
      });

      const resData = unwrapResponse(data);
      if (resData.code) {
        this.storage.savePKCE(codeVerifier, state);
        return resData.code;
      }
      return null;
    } catch {
      return null;
    }
  }

  public async refreshToken(token?: string): Promise<AuthSession | null> {
    const currentSession = this.storage.getSession();
    const refreshToken = token || currentSession?.refreshToken;

    // Early return: no point hitting the endpoint without a refresh token
    if (!refreshToken) return null;

    try {
      const data = await this.http.client.post<
        TokenResponse | { data: TokenResponse }
      >(
        this.config.endpoints?.token || '/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          refresh_token: refreshToken,
        })
      );

      const tokenResponse = unwrapResponse(data);
      const session = this.mapTokenResponse(tokenResponse);
      this.storage.saveSession(session);
      return session;
    } catch {
      return null;
    }
  }

  private mapTokenResponse(response: TokenResponse): AuthSession {
    return {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      expiresAt: Date.now() + response.expires_in * 1000,
      refreshToken: response.refresh_token,
      idToken: response.id_token,
      scope: response.scope,
    };
  }
}

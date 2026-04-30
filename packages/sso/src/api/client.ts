import axios from 'axios';
import { SSOSessionManager } from '../session/manager';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string; // Opsional jika pakai HttpOnly Cookie
  expires_in: number;
}

export interface SSOEndpoints {
  authorize: string; // GET /authorize (Check Session/Silent Login)
  login: string;     // POST /authorize (Portal Login Form)
  token: string;     // POST /token (Exchange & Refresh)
}

export interface SSOConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  endpoints?: Partial<SSOEndpoints>;
  onRedirect?: (url: string) => void | Promise<void>;
}

/**
 * SSO API Client to communicate with Backend port 8081
 */
export const createSSOClient = (config: SSOConfig) => {
  const api = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true, // Important for Silent Login session cookies
  });

  const endpoints: SSOEndpoints = {
    authorize: config.endpoints?.authorize || '/authorize',
    login: config.endpoints?.login || '/authorize',
    token: config.endpoints?.token || '/token',
  };

  // 🛡️ Request Interceptor: Inject Bearer Token
  api.interceptors.request.use((conf) => {
    const session = SSOSessionManager.get();
    if (session?.accessToken) {
      conf.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return conf;
  });

  // 🛡️ Response Interceptor: Auto Refresh on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const session = SSOSessionManager.get();
        if (session?.refreshToken) {
          try {
            console.log('[SSOClient] Access token expired. Attempting refresh...');
            
            // Panggil endpoint refresh secara manual (biar gak lewat interceptor ini lagi)
            const { data } = await axios.post(`${config.baseUrl}${endpoints.token}`, {
              client_id: config.clientId,
              refresh_token: session.refreshToken,
              grant_type: 'refresh_token',
            }, { withCredentials: true }); // Tetap tambahkan withCredentials demi fleksibilitas

            const unwrapped = data.data || data;
            
            SSOSessionManager.save({
              accessToken: unwrapped.access_token,
              refreshToken: unwrapped.refresh_token,
            });

            // Update header and retry
            originalRequest.headers.Authorization = `Bearer ${unwrapped.access_token}`;
            return api(originalRequest);
          } catch (refreshError) {
            SSOSessionManager.logout();
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    /**
     * Tahap A: Silent Login Check
     * Hit GET /authorize to check if user already has a session
     */
    async checkSilentLogin(params: { code_challenge: string; state: string }) {
      return api.get(endpoints.authorize, {
        params: {
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          code_challenge: params.code_challenge,
          state: params.state,
          response_type: 'code',
        },
      });
    },

    /**
     * Tahap B: Portal Login
     * Used by SSO App to exchange credentials for a code
     */
    async authorize(
      body: any & { state: string; client_id?: string; redirect_uri?: string }
    ) {
      return api.post(endpoints.login, {
        client_id: body.client_id || config.clientId,
        redirect_uri: body.redirect_uri || config.redirectUri,
        email: body.email,
        password: body.password,
        code_challenge: body.code_challenge,
        state: body.state,
      });
    },

    /**
     * Tahap C: Token Exchange
     * Hit POST /token to exchange code + verifier for JWT
     */
    async exchangeToken(params: {
      code: string;
      code_verifier: string;
    }): Promise<TokenResponse> {
      const { data } = await api.post(endpoints.token, {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        code: params.code,
        code_verifier: params.code_verifier,
        redirect_uri: config.redirectUri,
      });
      
      return data.data || data;
    },

    /**
     * Refresh Token
     * Hit POST /token to exchange refresh_token for a new access_token
     */
    async refreshToken(params?: {
      refresh_token?: string;
    }): Promise<TokenResponse> {
      const { data } = await api.post(endpoints.token, {
        client_id: config.clientId,
        refresh_token: params?.refresh_token,
        grant_type: 'refresh_token',
      });
      return data.data || data;
    },
  };
};

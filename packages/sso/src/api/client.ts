import axios from 'axios';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface SSOConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
}

/**
 * SSO API Client to communicate with Backend port 8081
 */
export const createSSOClient = (config: SSOConfig) => {
  const api = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true, // Important for Silent Login session cookies
  });

  return {
    /**
     * Tahap A: Silent Login Check
     * Hit GET /authorize to check if user already has a session
     */
    async checkSilentLogin(params: { code_challenge: string; state: string }) {
      return api.get('/authorize', {
        params: {
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          code_challenge: params.code_challenge,
          state: params.state,
          response_type: 'code',
        }
      });
    },

    /**
     * Tahap B: Portal Login
     * Used by SSO App to exchange credentials for a code
     */
    async authorize(body: any & { state: string }) {
      return api.post('/authorize', {
        ...body,
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
      });
    },

    /**
     * Tahap C: Token Exchange
     * Hit POST /token to exchange code + verifier for JWT
     */
    async exchangeToken(params: { code: string; code_verifier: string }): Promise<TokenResponse> {
      const { data } = await api.post('/token', {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        code: params.code,
        code_verifier: params.code_verifier,
        redirect_uri: config.redirectUri,
      });
      return data;
    },

    /**
     * Refresh Token
     * Hit POST /token to exchange refresh_token for a new access_token
     */
    async refreshToken(params: { refresh_token: string }): Promise<TokenResponse> {
      const { data } = await api.post('/token', {
        grant_type: 'refresh_token',
        client_id: config.clientId,
        refresh_token: params.refresh_token,
      });
      return data;
    },
  };
};

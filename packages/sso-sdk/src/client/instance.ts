import { HttpClient } from '@genossys-hospital/http-sdk';
import type { SSOConfig, TokenResponse } from '../types';

/**
 * SSO API Wrapper using centralized HttpClient
 */
export class SSOApi {
  public client: HttpClient;

  constructor(config: SSOConfig) {
    this.client = new HttpClient({
      baseURL: config.baseUrl,
      withCredentials: true,
      hooks: {
        getToken: () => config.onGetToken?.(),
        onRefreshToken: async () => {
          const tokenUrl = config.endpoints?.token || '/token';
          
          // Use axios instance directly to avoid infinite refresh loop if token call also fails with 401
          const { data } = await this.client.instance.post(
            tokenUrl,
            {
              grant_type: 'refresh_token',
              client_id: config.clientId,
            },
            { skipAuth: true }
          );

          const newTokenResponse: TokenResponse = data.data || data;
          const newToken = newTokenResponse.access_token;

          if (config.onSaveToken) {
            config.onSaveToken(newToken);
          }

          return newToken;
        },
        onUnauthorized: () => {
          if (config.onClearToken) config.onClearToken();
        }
      }
    });
  }

  /**
   * Getter for the underlying axios instance (if needed for direct access)
   */
  public get instance() {
    return this.client.instance;
  }
}

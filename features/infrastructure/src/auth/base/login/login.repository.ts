import type { AuthRepository, AuthUser, AuthCredentials, AuthResult } from '@genrs/core/auth/base/login';
import { SessionManager } from '@genrs/auth';
import { httpClient } from '../../../utils/http-client';
import {
  mapAuthResultFromResponse,
  mapAuthCredentialsToRequest,
  mapMeFromResponse,
} from './login.mapper';
import type { LoginResponse, MeResponse } from './login.schema';

/**
 * API-based implementation of AuthRepository with Shared-Cookie Support.
 * Handles communication with the Backend and local Session persistence.
 */
export class ApiAuthRepository implements AuthRepository {
  
  async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const request = mapAuthCredentialsToRequest(credentials);
      const { data } = await httpClient.post<LoginResponse>(
        '/auth/login',
        request
      );

      const result = mapAuthResultFromResponse(data);
      
      // Persist to Shared Cookies for SSO
      SessionManager.save({
        accessToken: result.accessToken,
        ...(result.refreshToken ? { refreshToken: result.refreshToken } : {}),
      });

      return result;
    } catch (error) {
      console.error('[ApiAuthRepository] Login Failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear local session first for better UX
      SessionManager.logout();
      
      // Notify backend if possible (fire and forget or wait)
      await httpClient.post('/auth/logout');
    } catch (error) {
      console.warn('[ApiAuthRepository] Logout API error (session cleared locally):', error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // If no local access token, don't bother calling API
      if (!SessionManager.isAuthenticated()) {
        return null;
      }

      const { data } = await httpClient.get<MeResponse>('/auth/me');
      return mapMeFromResponse(data);
    } catch (error) {
      // Silently fail for "me" check to avoid breaking UI state
      console.debug('[ApiAuthRepository] Get current user failed (User likely unauthenticated)');
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const { data } = await httpClient.post<{ data: { access_token: string } }>(
        '/auth/refresh'
      );
      
      const newAccessToken = data.data.access_token;
      
      // Sync to cookies
      SessionManager.save({
        accessToken: newAccessToken,
      });

      return newAccessToken;
    } catch (error) {
      console.error('[ApiAuthRepository] Refresh Token Failed:', error);
      throw error;
    }
  }
}

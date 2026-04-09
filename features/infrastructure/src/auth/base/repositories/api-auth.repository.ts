import type { AuthRepository } from '@genrs/core/auth/base/repositories/auth.repository';
import type { AuthUser } from '@genrs/core/auth/base/domains/models/auth.model';
import type { AuthCredentials } from '@genrs/core/auth/base/domains/inputs/auth.input';
import type { AuthResult } from '@genrs/core/auth/base/domains/models/auth.model';
import { httpClient } from '../../../utils/http-client';
import {
  mapAuthResultFromResponse,
  mapAuthUserFromResponse,
  mapAuthCredentialsToRequest,
} from '../mappers/auth.mapper';
import type { LoginResponse } from '../schemas/auth.schema';

/**
 * API-based implementation of AuthRepository.
 * Handles communication with the Backend.
 */
export class ApiAuthRepository implements AuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResult> {
    const request = mapAuthCredentialsToRequest(credentials);
    const { data } = await httpClient.post<LoginResponse>(
      '/auth/login',
      request
    );

    return mapAuthResultFromResponse(data);
  }

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data } = await httpClient.get('/auth/me');
      return mapAuthUserFromResponse(data);
    } catch (error) {
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    const { data } = await httpClient.post<{ access_token: string }>(
      '/auth/refresh'
    );
    return data.access_token;
  }
}

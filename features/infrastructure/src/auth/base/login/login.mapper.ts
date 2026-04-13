import type { AuthCredentials, AuthUser, AuthResult } from '@genrs/core/auth/base/login';
import type {
  LoginRequest,
  LoginResponse,
  UserResponse,
} from './login.schema';

/**
 * Mapper for Authentication Data
 * Responsibility: Convert between Schema (Infra) and Model (Core)
 */

export const mapAuthUserFromResponse = (data: UserResponse): AuthUser => {
  return {
    id: String(data.id),
    username: data.username,
    name: data.full_name || data.name || '',
    role: data.role_name || data.role || '',
    permissions: data.permissions || [],
    tenantId: data.tenant_id,
    metadata: data.metadata || {},
  };
};

export const mapAuthResultFromResponse = (data: LoginResponse): AuthResult => {
  return {
    user: mapAuthUserFromResponse(data.user),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
};

export const mapAuthCredentialsToRequest = (
  credentials: AuthCredentials
): LoginRequest => {
  return {
    username: credentials.username,
    password: credentials.password,
  };
};

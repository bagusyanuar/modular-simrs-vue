import type { AuthCredentials, AuthUser, AuthResult } from '@genrs/core/auth/base/login';
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
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

export const mapMeFromResponse = (response: MeResponse): AuthUser => {
  return mapAuthUserFromResponse(response.data);
};

export const mapAuthResultFromResponse = (response: LoginResponse): AuthResult => {
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const mapAuthCredentialsToRequest = (
  credentials: AuthCredentials
): LoginRequest => {
  return {
    email: credentials.email,
    password: credentials.password,
  };
};

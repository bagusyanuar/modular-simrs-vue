/**
 * Infrastructure Auth Schemas (Backend Contracts)
 */

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface UserResponse {
  id: number | string;
  username: string;
  full_name?: string;
  name?: string;
  role_name?: string;
  role?: string;
  permissions?: string[];
  tenant_id?: string;
  metadata?: Record<string, any>;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
}

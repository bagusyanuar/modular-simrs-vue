/**
 * Infrastructure Auth Schemas (Backend Contracts)
 */

export interface LoginRequest {
  email: string;
  password: string;
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
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

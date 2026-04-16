/**
 * Core Auth Models (Entities)
 */

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  permissions: string[];
  tenantId?: string;
  metadata?: Record<string, any>;
}

export interface AuthResult {
  user?: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

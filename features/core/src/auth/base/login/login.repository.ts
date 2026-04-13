import { AuthUser, AuthResult } from '../domains/models/auth.model';
import { AuthCredentials } from '../domains/inputs/auth.input';

/**
 * Interface for Authentication Repository
 * Following Clean Architecture, this will be implemented in the Infrastructure layer.
 */
export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  refreshToken(): Promise<string>;
}

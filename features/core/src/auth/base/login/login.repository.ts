import { AuthUser, AuthResult } from './login.model';
import { AuthCredentials } from './login.input';

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

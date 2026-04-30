import type { AuthorizeForm, SSOAuthorizeInput } from './auth.input';
import type { AuthorizeModel, AuthModel } from './auth.model';

export interface AuthRepository {
  authorize(input: AuthorizeForm): Promise<AuthorizeModel>;
  authorizePortal(input: SSOAuthorizeInput): Promise<AuthorizeModel>;
  exchangeToken(code: string, state: string): Promise<AuthModel>;
}

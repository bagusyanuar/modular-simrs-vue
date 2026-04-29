import type { AuthorizeForm } from './auth.input';
import type { AuthorizeModel, AuthModel } from './auth.model';

export interface AuthRepository {
  authorize(input: AuthorizeForm): Promise<AuthorizeModel>;
  exchangeToken(code: string, state: string): Promise<AuthModel>;
}

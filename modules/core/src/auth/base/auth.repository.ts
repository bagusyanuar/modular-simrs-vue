import type { AuthorizeForm } from './auth.input';
import type { AuthorizeModel } from './auth.model';

export interface AuthRepository {
  authorize(input: AuthorizeForm): Promise<AuthorizeModel>;
}

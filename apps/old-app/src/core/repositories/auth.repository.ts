import type { LoginForm } from '@/core/domains/inputs';
import type { Auth } from '@/core/domains/models';

export interface AuthRepository {
  login(input: LoginForm): Promise<Auth>;
}

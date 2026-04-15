import type { AuthRepository } from '@/core/repositories';
import type { LoginForm } from '@/core/domains/inputs';
import type { Auth } from '@/core/domains/models';

export class Login {
  private readonly repo: AuthRepository;
  constructor(repo: AuthRepository) {
    this.repo = repo;
  }

  async execute(credentials: LoginForm): Promise<Auth> {
    const authData = await this.repo.login(credentials);
    return authData;
  }
}

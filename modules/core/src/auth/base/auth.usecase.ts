import type { AuthRepository } from './auth.repository';
import type { AuthorizeForm } from './auth.input';
import type { AuthorizeModel } from './auth.model';

export class Authorize {
  constructor(private repository: AuthRepository) {}

  async execute(input: AuthorizeForm): Promise<AuthorizeModel> {
    return await this.repository.authorize(input);
  }
}

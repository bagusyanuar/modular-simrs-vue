import type { AuthRepository } from './auth.repository';
import type { AuthorizeForm } from './auth.input';
import type { AuthorizeModel, AuthModel } from './auth.model';

export class Authorize {
  constructor(private repository: AuthRepository) {}

  async execute(input: AuthorizeForm): Promise<AuthorizeModel> {
    return await this.repository.authorize(input);
  }
}

export class ExchangeToken {
  constructor(private repository: AuthRepository) {}

  async execute(code: string, state: string): Promise<AuthModel> {
    return await this.repository.exchangeToken(code, state);
  }
}

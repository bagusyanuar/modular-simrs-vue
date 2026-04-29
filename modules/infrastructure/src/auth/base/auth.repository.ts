import type {
  AuthorizeForm,
  AuthorizeModel,
  AuthModel,
  AuthRepository,
} from '@genossys-hospital/core/auth/base';
import type { SSOClient } from '@genossys-hospital/sso-sdk';
import {
  mapFormToCredentials,
  mapAuthorizeResponseToModel,
  mapTokenToDomain,
} from './auth.mapper';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly sso: SSOClient) {}

  async authorize(input: AuthorizeForm): Promise<AuthorizeModel> {
    const credentials = mapFormToCredentials(input);
    const { code } = await this.sso.authorizeManual(credentials);

    return mapAuthorizeResponseToModel({ code });
  }

  async exchangeToken(code: string, state: string): Promise<AuthModel> {
    const response = await this.sso.handleCallback(code, state);
    return mapTokenToDomain(response);
  }
}

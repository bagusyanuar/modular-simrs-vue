import type {
  AuthorizeForm,
  AuthorizeModel,
  AuthModel,
  AuthRepository,
  SSOAuthorizeInput,
} from '@genossys-hospital/core/auth/base';
import type { SSOClient } from '@genossys-hospital/sso-sdk';
import {
  mapFormToCredentials,
  mapAuthorizeResponseToModel,
  mapTokenToDomain,
} from './auth.mapper';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly sso: SSOClient) {}

  /**
   * Standard Login (Internal App)
   */
  async authorize(input: AuthorizeForm): Promise<AuthorizeModel> {
    const credentials = mapFormToCredentials(input);
    const { code } = await this.sso.authorizeManual(credentials);
    return mapAuthorizeResponseToModel({ code });
  }

  /**
   * SSO Portal Authorization (Third Party App)
   */
  async authorizePortal(input: SSOAuthorizeInput): Promise<AuthorizeModel> {
    const credentials = mapFormToCredentials(input);
    const { code } = await this.sso.authorize({
      ...credentials,
      clientId: input.clientId,
      redirectUri: input.redirectUri,
      state: input.state,
      codeChallenge: input.codeChallenge,
    });

    return mapAuthorizeResponseToModel({ code });
  }

  async exchangeToken(code: string, state: string): Promise<AuthModel> {
    const response = await this.sso.handleCallback(code, state);
    return mapTokenToDomain(response);
  }
}

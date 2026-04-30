import type {
  AuthorizeForm,
  AuthorizeModel,
  AuthModel,
} from '@genossys-hospital/core/auth/base';
import type { LoginCredentials, AuthSession } from '@genossys-hospital/sso-sdk';
import type { AuthorizeResponse } from './auth.schema';

export const mapFormToCredentials = (form: AuthorizeForm): LoginCredentials => {
  return {
    email: form.email,
    password: form.password,
  };
};

export const mapAuthorizeResponseToModel = (
  response: AuthorizeResponse
): AuthorizeModel => {
  return {
    code: response.code,
  };
};

export const mapTokenToDomain = (session: AuthSession): AuthModel => {
  return {
    accessToken: session.accessToken,
    expiresIn: Math.floor((session.expiresAt - Date.now()) / 1000),
  };
};

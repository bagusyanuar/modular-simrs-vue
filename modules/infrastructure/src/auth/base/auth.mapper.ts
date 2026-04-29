import type {
  AuthorizeForm,
  AuthorizeModel,
  AuthModel,
} from '@genossys-hospital/core/auth/base';
import type { LoginCredentials } from '@genossys-hospital/sso-sdk';
import type { AuthorizeResponse, TokenSchema } from './auth.schema';

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

export const mapTokenToDomain = (schema: TokenSchema): AuthModel => {
  return {
    accessToken: schema.access_token,
    expiresIn: schema.expires_in,
  };
};

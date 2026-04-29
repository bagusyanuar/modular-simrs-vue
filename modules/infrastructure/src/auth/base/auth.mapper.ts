import type {
  AuthorizeForm,
  AuthorizeModel,
} from '@genossys-hospital/core/auth/base';
import type { AuthorizeRequest, AuthorizeResponse } from './auth.schema';

export const mapAuthorizeFormToRequest = (
  form: AuthorizeForm
): AuthorizeRequest => {
  return {
    email: form.email,
    password: form.password,
    client_id: form.clientId,
    code_challenge: form.codeChallenge,
    redirect_uri: form.redirectUri,
  };
};

export const mapAuthorizeResponseToModel = (
  response: AuthorizeResponse
): AuthorizeModel => {
  return {
    code: response.code,
  };
};

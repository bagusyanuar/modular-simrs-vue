export interface AuthorizeForm {
  email: string;
  password: string;
}

export interface SSOAuthorizeInput extends AuthorizeForm {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}

export interface ExchangeTokenInput {
  grantType: string;
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface RefreshTokenInput {
  grantType: string;
  clientId: string;
}

export interface SilentLoginParams {
  clientId: string;
  codeChallenge: string;
  redirectUri: string;
  state: string;
  responseType: string;
}

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

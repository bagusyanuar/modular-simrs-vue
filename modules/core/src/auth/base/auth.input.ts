export interface AuthorizeForm {
  email: string;
  password: string;
  codeChallenge: string;
  state: string;
  clientId: string;
  redirectUri: string;
}

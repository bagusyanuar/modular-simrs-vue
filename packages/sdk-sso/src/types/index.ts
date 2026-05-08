export interface SSOConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  endpoints?: {
    authorize?: string;
    token?: string;
    logout?: string;
    userinfo?: string;
  };
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
  refreshToken?: string;
  idToken?: string;
  scope?: string;
}

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

export interface AuthorizeParams {
  state?: string;
  prompt?: string;
  [key: string]: string | undefined;
}

export interface DirectLoginParams {
  username?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface AuthorizeResponse {
  code: string;
  state?: string;
}

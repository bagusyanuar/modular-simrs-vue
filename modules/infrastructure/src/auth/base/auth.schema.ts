export interface AuthorizeResponse {
  code: string;
}

export interface TokenSchema {
  access_token: string;
  expires_in: number;
}

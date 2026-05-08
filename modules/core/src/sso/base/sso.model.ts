export interface AuthorizeModel {
  code: string;
  state: string;
}

export interface ExchangeTokenModel {
  accessToken: string;
  expiresIn: number;
}

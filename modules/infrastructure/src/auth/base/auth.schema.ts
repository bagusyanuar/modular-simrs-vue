export interface AuthorizeRequest {
  email: string;
  password: string;
  client_id: string;
  code_challenge: string;
  redirect_uri: string;
}

export interface AuthorizeResponse {
  code: string;
}

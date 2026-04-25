export interface AuthorizeInput {
  email: string;
  password: string;
  code_challenge: string;
  state: string;
  client_id: string;
  redirect_uri: string;
}

export interface AuthorizeOutput {
  code: string;
}

export interface IAuthorizeRepository {
  authorize(input: AuthorizeInput): Promise<AuthorizeOutput>;
}

export class AuthorizeUseCase {
  constructor(private repository: IAuthorizeRepository) {}

  async execute(input: AuthorizeInput): Promise<AuthorizeOutput> {
    return await this.repository.authorize(input);
  }
}

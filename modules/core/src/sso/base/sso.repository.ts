import type {
  SSOAuthorizeInput,
  ExchangeTokenInput,
  RefreshTokenInput,
} from './sso.input';
import type { AuthorizeModel, ExchangeTokenModel } from './sso.model';

export interface SSORepository {
  authorize(input: SSOAuthorizeInput): Promise<AuthorizeModel>;
  exchangeToken(input: ExchangeTokenInput): Promise<ExchangeTokenModel>;
  refreshToken(input: RefreshTokenInput): Promise<AuthorizeModel>;
}

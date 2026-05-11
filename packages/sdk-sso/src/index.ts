// Public API — only export what consumers need
export type {
  SSOConfig,
  AuthSession,
  PKCEPair,
  AuthorizeParams,
  DirectLoginParams,
  AuthorizeResponse,
  TokenResponse,
} from './types';

export { SSOClient } from './client';
export { createSSOGuard, type GuardOptions } from './vue/guard';

// Error classes — consumers need these for instanceof checks
export {
  SSOError,
  PKCEError,
  StateMismatchError,
  TokenExchangeError,
  SessionExpiredError,
  AuthorizeError,
} from './errors';

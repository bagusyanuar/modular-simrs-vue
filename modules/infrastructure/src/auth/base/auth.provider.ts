import { SSOClient } from '@genossys-hospital/sso-sdk';
import { Authorize, ExchangeToken } from '@genossys-hospital/core/auth/base';
import { AuthRepositoryImpl } from './auth.repository';
import { getEnv } from '@genrs/utils';

/**
 * Dependency Injection Provider for Auth Module
 * Centralized instantiation of SSO SDK, repositories, and usecases.
 */

// 1. Initialize SSO SDK
const ssoClient = new SSOClient({
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: getEnv('VITE_SSO_CLIENT_ID'),
  redirectUri: getEnv('VITE_SSO_REDIRECT_URI'),
  persistence: 'localstorage',
});

// 2. Repository Instance
const authRepository = new AuthRepositoryImpl(ssoClient);

// 3. Export UseCase Instances (Ready for Presentation Layer)
export const authorizeUseCase = new Authorize(authRepository);
export const exchangeTokenUseCase = new ExchangeToken(authRepository);

// Export SDK client just in case needed for direct access (e.g. interceptors)
export { ssoClient };

import { LoginUseCase } from '@genrs/core/auth/base/login';
import { ApiAuthRepository } from './login.repository';

/**
 * Dependency Injection Provider for Auth
 * Centralized instantiation of repositories and usecases.
 */

const authRepository = new ApiAuthRepository();

export const loginUseCase = new LoginUseCase(authRepository);

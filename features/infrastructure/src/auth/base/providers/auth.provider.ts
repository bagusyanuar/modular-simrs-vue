import { LoginUseCase } from '@genrs/core/auth/base/usecases/login.usecase';
import { ApiAuthRepository } from '../repositories/api-auth.repository';

/**
 * Dependency Injection Provider for Auth
 * Centralized instantiation of repositories and usecases.
 */

const authRepository = new ApiAuthRepository();

export const loginUseCase = new LoginUseCase(authRepository);

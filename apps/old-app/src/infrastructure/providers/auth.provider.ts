import httpClient from '@/infrastructure/sources/api/api';
import { ApiAuthRepository } from '@/infrastructure/repositories/auth.repository-impl';
import { Login } from '@/core/usecases/login.usecase';

const authRepository = new ApiAuthRepository(httpClient);

export const loginUseCase = new Login(authRepository);

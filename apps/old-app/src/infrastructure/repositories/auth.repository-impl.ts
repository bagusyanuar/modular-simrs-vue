import type { AuthRepository } from '@/core/repositories';
import type { LoginForm } from '@/core/domains/inputs';
import type { Auth } from '@/core/domains/models';
import { AxiosInstance } from 'axios';
import {
  mapLoginFormToRequest,
  mapLoginResponseToModel,
} from '@/infrastructure/mappers';
import {
  LoginRequest,
  LoginResponse,
  APIResponse,
} from '@/infrastructure/schemas';

export class ApiAuthRepository implements AuthRepository {
  private httpClient: AxiosInstance;
  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }
  async login(input: LoginForm): Promise<Auth> {
    const request = mapLoginFormToRequest(input);
    const response = await this.httpClient.post<APIResponse<LoginResponse>>(
      '/auth/login',
      request
    );
    const data = response.data.data;
    if (!data) {
      throw new Error('Login failed');
    }
    return mapLoginResponseToModel(data);
  }
}

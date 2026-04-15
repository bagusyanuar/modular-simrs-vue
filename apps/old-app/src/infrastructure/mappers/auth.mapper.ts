import type { LoginForm } from '@/core/domains/inputs';
import type { Auth } from '@/core/domains/models';
import type { LoginRequest, LoginResponse } from '@/infrastructure/schemas';

export const mapLoginFormToRequest = (form: LoginForm): LoginRequest => {
  return {
    email: form.email,
    password: form.password,
  };
};

export const mapLoginResponseToModel = (entry: LoginResponse): Auth => {
  return {
    accessToken: entry.access_token,
  };
};

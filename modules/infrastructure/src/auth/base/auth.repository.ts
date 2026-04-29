import type {
  AuthorizeForm,
  AuthorizeModel,
  AuthRepository,
} from '@genossys-hospital/core/auth/base';

export class AuthRepositoryImpl implements AuthRepository {
  async authorize(input: AuthorizeForm): Promise<AuthorizeModel> {
    throw new Error('Method not implemented.');
  }
}

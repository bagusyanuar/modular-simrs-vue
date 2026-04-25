import { ssoClient } from '@/api/sso-client';
import type { 
  IAuthorizeRepository, 
  AuthorizeInput, 
  AuthorizeOutput 
} from '@/core/auth/authorize.usecase';

export class SSORepository implements IAuthorizeRepository {
  async authorize(input: AuthorizeInput): Promise<AuthorizeOutput> {
    const response = await ssoClient.authorize(input);
    
    if (response.status === 200 && response.data?.code) {
      return {
        code: response.data.code
      };
    }
    
    throw new Error(response.data?.message || 'Gagal mendapatkan otorisasi dari server.');
  }
}

// Export singleton instance
export const ssoRepository = new SSORepository();

import { ssoClient } from '@/api/sso-client';
import type { 
  IAuthorizeRepository, 
  AuthorizeInput, 
  AuthorizeOutput 
} from '@/core/auth/authorize.usecase';

export class SSORepository implements IAuthorizeRepository {
  async authorize(input: AuthorizeInput): Promise<AuthorizeOutput> {
    // Sekarang kita teruskan semua field termasuk client_id & redirect_uri
    const response = await ssoClient.authorize(input);
    
    // Backend mungkin mengembalikan data langsung atau di-wrap dalam property 'data'
    const code = response.data?.code || response.data?.data?.code;

    if (response.status === 200 && code) {
      return { code };
    }
    
    throw new Error(response.data?.message || 'Gagal mendapatkan otorisasi dari server.');
  }
}

export const ssoRepository = new SSORepository();

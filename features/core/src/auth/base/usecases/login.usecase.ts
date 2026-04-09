import type { AuthRepository } from '../repositories/auth.repository';
import { AuthCredentials } from '../domains/inputs/auth.input';
import { AuthResult } from '../domains/models/auth.model';

/**
 * Handle Login process and potential post-login side effects
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<AuthResult> {
    // 1. Validate credentials if needed here
    
    // 2. Perform login via repository
    const result = await this.authRepository.login(credentials);
    
    // 3. Optional: Perform side effects (analytics, analytics, syncing data, etc.)
    console.log(`[LoginUseCase] User ${result.user.username} logged in successfully.`);
    
    return result;
  }
}

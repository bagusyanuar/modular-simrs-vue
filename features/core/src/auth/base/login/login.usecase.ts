import type { AuthRepository } from './login.repository';
import { AuthCredentials } from './login.input';
import { AuthResult } from './login.model';

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

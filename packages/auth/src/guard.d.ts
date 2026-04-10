import type { Router } from 'vue-router';
import { type AuthSession } from './session';
export interface GuardOptions {
    callbackPath?: string;
    onTokenExchange?: (code: string, verifier: string) => Promise<AuthSession>;
}
/**
 * Creates a centralized SSO Navigation Guard with PKCE support.
 * @param router - Vue Router instance
 * @param options - Custom options for callback path and token exchange
 */
export declare function createSSOGuard(router: Router, options?: GuardOptions): void;
//# sourceMappingURL=guard.d.ts.map
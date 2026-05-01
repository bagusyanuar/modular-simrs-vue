import type { Router } from 'vue-router';
import type { SSOClient } from '../client/sso-client';
import type { AuthSession, SSOConfig } from '../types';

export interface GuardOptions {
  auth: SSOClient;
  callbackPath?: string;
  publicRoutes?: string[];
  /** Optional session configuration to override client defaults */
  sessionConfig?: Partial<SSOConfig>;
  /** Hook called when user is successfully authenticated (Safe with AuthSession type) */
  onAuthenticated?: (session: AuthSession) => Promise<void> | void;
  /** Hook called when authentication fails */
  onAuthError?: (error: Error) => void;
  /**
   * Whether to automatically redirect to SSO Portal if unauthenticated.
   * Default: true
   */
  autoRedirect?: boolean;
}

/**
 * Enhanced Vue Router Guard for SSO SDK
 */
export function createSSOGuard(router: Router, options: GuardOptions) {
  const { auth } = options;
  const callbackPath = options.callbackPath || '/callback';

  // Apply optional session configuration
  if (options.sessionConfig) {
    auth.updateConfig(options.sessionConfig);
  }

  router.beforeEach(async (to, _from, next) => {
    // 1. Handle Callback Route
    if (to.path === callbackPath) {
      const code = to.query.code as string;
      const state = to.query.state as string;

      if (code && state) {
        try {
          const session = await auth.handleCallback(code, state);

          // Trigger hook if provided
          if (options.onAuthenticated) {
            await options.onAuthenticated(session);
          }

          return next('/');
        } catch (error) {
          const err =
            error instanceof Error
              ? error
              : new Error('Authentication callback failed');
          if (options.onAuthError) {
            options.onAuthError(err);
          } else {
            console.error('[SSOSDK] Callback error:', err);
          }
          return next('/');
        }
      }
    }

    // 2. Skip Public Routes
    if (to.meta.public || options.publicRoutes?.includes(to.path)) {
      return next();
    }

    // 3. Check Local Session
    if (auth.getAccessToken()) {
      return next();
    }

    // 4. Try Silent Refresh (Using Refresh Token Cookie)
    // This handles page reloads when persistence is 'memory'
    const session = await auth.refreshAccessToken();
    if (session) {
      if (options.onAuthenticated) {
        await options.onAuthenticated(session);
      }
      return next();
    }

    // 5. Try Silent Login (Check SSO Global Session via SSO Portal)
    const silentCode = await auth.checkSilentLogin();
    if (silentCode) {
      try {
        const stateKey = auth.getStorageKeys().pkceState;
        const state = (window.sessionStorage.getItem(stateKey) || '') as string;
        const silentSession = await auth.handleCallback(silentCode, state);

        // Trigger hook if provided
        if (options.onAuthenticated) {
          await options.onAuthenticated(silentSession);
        }

        return next();
      } catch (error) {
        console.warn('[SSOSDK] Silent login failed:', error);
        // Fall through to redirect if silent login fails
      }
    }

    // 6. Final Step: Redirect to Portal
    if (options.autoRedirect !== false) {
      await auth.login();
    }
    return next(false);
  });
}

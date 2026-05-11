import type { Router, RouteLocationNormalized } from 'vue-router';
import type { SSOClient } from '../client';
import type { AuthSession } from '../types';

export interface GuardOptions {
  auth: SSOClient;
  callbackPath?: string;
  publicRoutes?: string[];
  onAuthenticated?: (session: AuthSession) => Promise<void> | void;
  onAuthError?: (error: Error) => void;
  onBeforeRedirect?: (to: RouteLocationNormalized) => void;
  onSessionExpired?: () => void;
  autoRedirect?: boolean;
}

/**
 * Creates a Vue Router navigation guard for SSO authentication.
 * Uses vue-router v5 return-based API (no deprecated `next()` callback).
 */
export function createSSOGuard(router: Router, options: GuardOptions) {
  const { auth } = options;
  const callbackPath = options.callbackPath || '/callback';

  router.beforeEach(async (to) => {
    // 1. Handle Callback Route
    if (to.path === callbackPath || to.path === `${callbackPath}/`) {
      const code = to.query.code as string;
      const state = to.query.state as string;

      if (code) {
        try {
          const session = await auth.callback(code, state);

          if (options.onAuthenticated) {
            await options.onAuthenticated(session);
          }

          return '/';
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
          return '/';
        }
      }
    }

    // 2. Skip Public Routes
    if (to.meta?.public || options.publicRoutes?.includes(to.path)) {
      return true;
    }

    // 3. Check Local Session
    if (auth.isAuthenticated()) {
      return true;
    }

    // 4. Try Silent Refresh (Token)
    const refreshedSession = await auth.refreshToken();
    if (refreshedSession) {
      if (options.onAuthenticated) {
        await options.onAuthenticated(refreshedSession);
      }
      return true;
    }

    // 5. Try Silent Login (PKCE Auth Flow)
    try {
      const silentCode = await auth.silentLogin();
      if (silentCode) {
        const silentSession = await auth.callback(silentCode);

        if (options.onAuthenticated) {
          await options.onAuthenticated(silentSession);
        }

        return true;
      }
    } catch (error) {
      console.warn('[SSOSDK] Silent login failed:', error);
    }

    // 6. Session is truly expired — notify consumer
    if (options.onSessionExpired) {
      options.onSessionExpired();
    }

    // 7. Redirect to SSO Portal
    if (options.autoRedirect !== false) {
      try {
        if (options.onBeforeRedirect) {
          options.onBeforeRedirect(to);
        }

        const url = await auth.authorize();
        setTimeout(() => {
          window.location.href = url;
        }, 0);
      } catch (error) {
        console.error('[SSOSDK] Failed to generate authorize URL', error);
      }
      return false;
    }

    return false;
  });
}

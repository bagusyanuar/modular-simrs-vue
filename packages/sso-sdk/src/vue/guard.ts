import type { Router } from 'vue-router';
import type { SSOClient } from '../index';

export interface GuardOptions {
  auth: SSOClient;
  callbackPath?: string;
  publicRoutes?: string[]; // Alternative to meta.public
}

/**
 * Optimized Vue Router Guard for SSO SDK
 */
export function createSSOGuard(router: Router, options: GuardOptions) {
  const { auth } = options;
  const callbackPath = options.callbackPath || '/callback';

  router.beforeEach(async (to, _from, next) => {
    // 1. Handle Callback Route
    if (to.path === callbackPath) {
      const code = to.query.code as string;
      const state = to.query.state as string;

      if (code && state) {
        try {
          await auth.handleCallback(code, state);
          return next('/');
        } catch (error) {
          console.error('[SSOSDK] Callback error:', error);
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

    // 4. Try Silent Login (Check SSO Global Session)
    const silentCode = await auth.checkSilentLogin();
    if (silentCode) {
      try {
        // Exchange code immediately
        const state = (window.sessionStorage.getItem('pkce_state') ||
          '') as string;
        await auth.handleCallback(silentCode, state);
        return next();
      } catch {
        // Fall through to redirect
      }
    }

    // 5. Final Step: Redirect to Portal
    // We use portal URL with full PKCE challenge
    auth.login(); // This will trigger window.location.href redirect
    return next(false);
  });
}

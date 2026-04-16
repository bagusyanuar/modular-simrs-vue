import type { Router } from 'vue-router';
import { SessionManager } from './session';

/**
 * Creates a centralized Shared-Cookie SSO Navigation Guard.
 * Redirects to the SSO Login page if no session is detected.
 * 
 * @param router - Vue Router instance
 */
export function createSSOGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    
    // 1. Check if authenticated (via shared cookie)
    if (SessionManager.isAuthenticated()) {
      return next();
    }

    // 2. Trigger Login Redirect to SSO Application
    const { authServerUrl } = SessionManager.config;
    
    // Normalize Base URL & Path
    const baseUrl = authServerUrl.endsWith('/') ? authServerUrl.slice(0, -1) : authServerUrl;
    const ssoPath = import.meta.env.VITE_PATH_SSO || '/sso';
    const ssoUrl = ssoPath.startsWith('/') ? `${baseUrl}${ssoPath}` : `${baseUrl}/${ssoPath}`;
    
    // Add return_url for seamless redirection after login
    const returnUrl = encodeURIComponent(window.location.href);
    
    console.log('🚀 No session found. Redirecting to SSO Login...');
    window.location.href = `${ssoUrl}/login?return_url=${returnUrl}`;
    
    // Blocking next() as we are redirecting the entire window
  });
}

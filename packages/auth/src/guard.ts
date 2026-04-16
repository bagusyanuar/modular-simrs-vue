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
    // Skip guard for public routes (e.g. SSO login page itself)
    if (to.meta?.public) {
      return next();
    }

    const isAuth = SessionManager.isAuthenticated();
    console.log(`[SSOGuard] Navigating to: ${to.path}. Authenticated: ${isAuth}`);

    // 1. Check if authenticated (via shared cookie)
    if (isAuth) {
      console.log('[SSOGuard] Access granted.');
      return next();
    }

    // 2. Trigger Login Redirect to SSO Application
    const { authServerUrl } = SessionManager.config;
    
    // Normalize Base URL & Path
    const baseUrl = authServerUrl.endsWith('/') ? authServerUrl.slice(0, -1) : authServerUrl;
    const ssoPath = String(import.meta.env.VITE_PATH_SSO || '/sso');
    const ssoUrl = ssoPath.startsWith('/') ? `${baseUrl}${ssoPath}` : `${baseUrl}/${ssoPath}`;
    
    // Add return_url for seamless redirection after login
    // Gunakan origin + pathname agar tidak menumpuk query string sebelumnya
    const currentUrl = window.location.origin + window.location.pathname;
    const returnUrl = encodeURIComponent(currentUrl);
    
    console.log('🚀 No session found. Redirecting to SSO Login...');

    // PENTING: next(false) harus dipanggil dulu untuk block Vue Router
    // sebelum browser benar-benar navigate via window.location
    next(false);
    window.location.href = `${ssoUrl}/login?return_url=${returnUrl}`;
  });
}

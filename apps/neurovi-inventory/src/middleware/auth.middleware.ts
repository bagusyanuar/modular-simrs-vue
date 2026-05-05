import type { Router } from 'vue-router';

/**
 * Setup Authentication Middleware
 * Kicks user to V1_APP_URL/login if token is missing
 */
export const setupAuthMiddleware = (router: Router) => {
  router.beforeEach((to) => {
    // 1. Get token from localStorage
    const token = localStorage.getItem('token');

    // 2. Get Login URL from environment variables
    const loginUrl = `${import.meta.env.VITE_V1_APP_URL}/login`;

    // 3. Current URL for return_url parameter
    const currentUrl = window.location.href;

    // 4. Check if the route requires auth (default to true for safety)
    const requiresAuth = to.meta.requiresAuth !== false;

    if (!token && requiresAuth) {
      console.warn(
        '[AuthMiddleware] No token found. Redirecting to central login...'
      );

      // Redirect with return_url so user comes back here after login
      const redirectUrl = `${loginUrl}?return_url=${encodeURIComponent(currentUrl)}`;
      window.location.href = redirectUrl;

      // Return false to cancel the current navigation
      return false;
    }

    // Continue navigation
    return true;
  });
};

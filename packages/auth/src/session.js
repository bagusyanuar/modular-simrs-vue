import { CookieStorage } from './storage';
/**
 * SessionManager logic
 * Handles syncing tokens from Backend Body to Domain Cookies for SSO
 */
export const SessionManager = {
    // Default values
    config: {
        domain: '.neurovi-simulation.test',
        secure: false,
        expires: 7,
        clientId: '',
        redirectUri: '',
        authServerUrl: 'http://neurovi-simulation.test:3000',
    },
    /**
     * Update configuration (e.g. from app environment)
     */
    configure(config) {
        this.config = { ...this.config, ...config };
    },
    /**
     * Saves tokens received from Backend into shared domain cookies
     */
    save(session) {
        const { domain, secure, expires } = this.config;
        CookieStorage.set('access_token', session.accessToken, {
            domain,
            secure,
            expires,
            path: '/'
        });
        CookieStorage.set('refresh_token', session.refreshToken, {
            domain,
            secure,
            expires,
            path: '/'
        });
    },
    /**
     * Retrieves current session from shared cookies
     */
    get() {
        const accessToken = CookieStorage.get('access_token');
        const refreshToken = CookieStorage.get('refresh_token');
        if (!accessToken || !refreshToken)
            return null;
        return { accessToken, refreshToken };
    },
    /**
     * Clears session from shared cookies (Logout)
     */
    logout() {
        const { domain } = this.config;
        CookieStorage.remove('access_token', { domain, path: '/' });
        CookieStorage.remove('refresh_token', { domain, path: '/' });
    },
    /**
     * Check if user is authenticated (simple check)
     */
    isAuthenticated() {
        return !!CookieStorage.get('access_token');
    }
};
//# sourceMappingURL=session.js.map
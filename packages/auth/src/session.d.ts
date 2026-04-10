/**
 * Session Interface matching Backend Payload
 */
export interface AuthSession {
    accessToken: string;
    refreshToken: string;
}
/**
 * Session Configuration Interface
 */
export interface SessionConfig {
    domain: string;
    secure: boolean;
    expires: number;
    clientId: string;
    redirectUri: string;
    authServerUrl: string;
}
/**
 * SessionManager logic
 * Handles syncing tokens from Backend Body to Domain Cookies for SSO
 */
export declare const SessionManager: {
    config: SessionConfig;
    /**
     * Update configuration (e.g. from app environment)
     */
    configure(config: Partial<SessionConfig>): void;
    /**
     * Saves tokens received from Backend into shared domain cookies
     */
    save(session: AuthSession): void;
    /**
     * Retrieves current session from shared cookies
     */
    get(): AuthSession | null;
    /**
     * Clears session from shared cookies (Logout)
     */
    logout(): void;
    /**
     * Check if user is authenticated (simple check)
     */
    isAuthenticated(): boolean;
};
//# sourceMappingURL=session.d.ts.map
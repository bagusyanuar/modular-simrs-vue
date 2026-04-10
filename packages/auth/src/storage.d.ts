/**
 * Auth Storage Utilities
 * Handles Cookies (for SSO) and SessionStorage (for PKCE)
 */
export interface CookieOptions {
    domain?: string;
    path?: string;
    expires?: number | Date;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
}
/**
 * Native Cookie Storage Helper (Zero Dependency)
 */
export declare const CookieStorage: {
    set(name: string, value: string, options?: CookieOptions): void;
    get(name: string): string | null;
    remove(name: string, options?: CookieOptions): void;
};
/**
 * Session Storage Helper for PKCE Artifacts
 */
export declare const PKCEStorage: {
    setVerifier(verifier: string): void;
    getVerifier(): string | null;
    clearVerifier(): void;
    setState(state: string): void;
    getState(): string | null;
    clearState(): void;
};
//# sourceMappingURL=storage.d.ts.map
/**
 * Auth Storage Utilities
 * Handles Cookies (for SSO) and SessionStorage (for PKCE)
 */
/**
 * Native Cookie Storage Helper (Zero Dependency)
 */
export const CookieStorage = {
    set(name, value, options = {}) {
        if (typeof document === 'undefined')
            return;
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        const { domain, path = '/', expires, secure, sameSite = 'Lax' } = options;
        if (expires) {
            if (typeof expires === 'number') {
                const date = new Date();
                date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
                cookieString += `; expires=${date.toUTCString()}`;
            }
            else {
                cookieString += `; expires=${expires.toUTCString()}`;
            }
        }
        if (path)
            cookieString += `; path=${path}`;
        if (domain)
            cookieString += `; domain=${domain}`;
        if (sameSite)
            cookieString += `; samesite=${sameSite}`;
        if (secure)
            cookieString += '; secure';
        document.cookie = cookieString;
    },
    get(name) {
        if (typeof document === 'undefined')
            return null;
        const nameLenPlus = encodeURIComponent(name).length + 1;
        return (document.cookie
            .split(';')
            .map((c) => c.trim())
            .filter((cookie) => cookie.substring(0, nameLenPlus) === `${encodeURIComponent(name)}=`)
            .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] ?? null);
    },
    remove(name, options = {}) {
        this.set(name, '', { ...options, expires: -1 });
    },
};
/**
 * Session Storage Helper for PKCE Artifacts
 */
export const PKCEStorage = {
    setVerifier(verifier) {
        if (typeof sessionStorage === 'undefined')
            return;
        sessionStorage.setItem('pkce_verifier', verifier);
    },
    getVerifier() {
        if (typeof sessionStorage === 'undefined')
            return null;
        return sessionStorage.getItem('pkce_verifier');
    },
    clearVerifier() {
        if (typeof sessionStorage === 'undefined')
            return;
        sessionStorage.removeItem('pkce_verifier');
    },
    setState(state) {
        if (typeof sessionStorage === 'undefined')
            return;
        sessionStorage.setItem('pkce_state', state);
    },
    getState() {
        if (typeof sessionStorage === 'undefined')
            return null;
        return sessionStorage.getItem('pkce_state');
    },
    clearState() {
        if (typeof sessionStorage === 'undefined')
            return;
        sessionStorage.removeItem('pkce_state');
    },
};
//# sourceMappingURL=storage.js.map
import type { Router } from 'vue-router';
import { SSOSessionManager } from '../session/manager';
import { generateVerifier, generateChallenge } from '../core/pkce';
import { createSSOClient, type SSOConfig } from '../api/client';

export interface SSOGuardOptions extends SSOConfig {
  portalUrl: string; // URL to the SSO Portal UI (e.g. apps/sso)
  callbackPath?: string; // Default: /callback
  sessionConfig?: {
    domain: string;
    secure?: boolean;
    expires?: number;
  };
}

/**
 * Enhanced SSO Navigation Guard implementing PKCE & Silent Login
 */
export function createSSOGuard(router: Router, options: SSOGuardOptions) {
  const client = createSSOClient(options);
  const callbackPath = options.callbackPath || '/callback';

  // Configure internal session manager
  if (options.sessionConfig) {
    SSOSessionManager.configure({
      domain: options.sessionConfig.domain,
      secure: options.sessionConfig.secure ?? false,
      expires: options.sessionConfig.expires ?? 7,
    });
  }

  router.beforeEach(async (to, _from, next) => {
    // 1. Skip for public routes
    if (to.meta?.public) return next();

    // 2. Handle Callback Route (Tahap C)
    if (to.path === callbackPath) {
      const code = to.query.code as string;
      const verifier = sessionStorage.getItem('sso_verifier');

      if (code && verifier) {
        try {
          const tokens = await client.exchangeToken({ code, code_verifier: verifier });
          SSOSessionManager.save({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });
          
          // Cleanup
          sessionStorage.removeItem('sso_verifier');
          
          // Redirect to home or original target
          return next('/');
        } catch (error) {
          console.error('[SSOGuard] Token Exchange Failed:', error);
          return next(false);
        }
      }
    }

    // 3. Check local session
    if (SSOSessionManager.isAuthenticated()) {
      return next();
    }

    // 4. Tahap A: PKCE & Silent Login Check
    try {
      const verifier = generateVerifier();
      const challenge = await generateChallenge(verifier);
      
      sessionStorage.setItem('sso_verifier', verifier);

      const response = await client.checkSilentLogin({ code_challenge: challenge });
      
      // If 200 OK, backend might return code directly in data or redirect
      // Based on docs: "ambil code dari data response, lalu lanjut ke Tahap C"
      if (response.status === 200 && response.data?.code) {
        const code = response.data.code;
        const tokens = await client.exchangeToken({ code, code_verifier: verifier });
        
        SSOSessionManager.save({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        });

        sessionStorage.removeItem('sso_verifier');
        return next();
      }
    } catch (error: any) {
      // 5. Silent Login Failed (401) -> Redirect to Portal (Tahap B)
      if (error.response?.status === 401) {
        console.log('[SSOGuard] Silent login failed. Redirecting to Portal...');
        
        const verifier = sessionStorage.getItem('sso_verifier');
        if (!verifier) return next(false);

        const challenge = await generateChallenge(verifier);
        const returnUrl = encodeURIComponent(window.location.origin + callbackPath);
        
        const loginUrl = `${options.portalUrl}/login?client_id=${options.clientId}&code_challenge=${challenge}&redirect_uri=${returnUrl}`;
        
        next(false);
        window.location.href = loginUrl;
        return;
      }
      
      console.error('[SSOGuard] Critical Error:', error);
      return next(false);
    }
  });
}

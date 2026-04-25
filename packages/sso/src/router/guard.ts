import type { Router } from 'vue-router';
import { SSOSessionManager, type AuthSession } from '../session/manager';
import { generateVerifier, generateChallenge, generateRandomString } from '../core/pkce';
import { createSSOClient, type SSOConfig } from '../api/client';

export interface SSOGuardOptions extends SSOConfig {
  portalUrl: string; // URL to the SSO Portal UI (e.g. apps/sso)
  callbackPath?: string; // Default: /callback
  sessionConfig?: {
    domain: string;
    secure?: boolean;
    expires?: number;
  };
  onAuthenticated?: (session: AuthSession) => void;
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
      const state = to.query.state as string;
      const verifier = sessionStorage.getItem('sso_verifier');
      const savedState = sessionStorage.getItem('sso_state');

      // CSRF Protection: Validate state
      if (state !== savedState) {
        console.error('[SSOGuard] State mismatch! CSRF attack detected.');
        return next(false);
      }

      if (code && verifier) {
        try {
          const tokens = await client.exchangeToken({ code, code_verifier: verifier });
          const session = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          };

          SSOSessionManager.save(session);
          
          // Trigger optional callback for Pinia
          if (options.onAuthenticated) {
            options.onAuthenticated(session);
          }
          
          // Cleanup
          sessionStorage.removeItem('sso_verifier');
          sessionStorage.removeItem('sso_state');
          
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
      const state = generateRandomString();
      
      sessionStorage.setItem('sso_verifier', verifier);
      sessionStorage.setItem('sso_state', state);

      const response = await client.checkSilentLogin({ 
        code_challenge: challenge,
        state: state
      });
      
      if (response.status === 200 && response.data?.code) {
        const code = response.data.code;
        const tokens = await client.exchangeToken({ code, code_verifier: verifier });
        const session = {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        };

        SSOSessionManager.save(session);

        if (options.onAuthenticated) {
          options.onAuthenticated(session);
        }

        sessionStorage.removeItem('sso_verifier');
        sessionStorage.removeItem('sso_state');
        return next();
      }
    } catch (error: any) {
      // 5. Silent Login Failed (401) -> Redirect to Portal (Tahap B)
      if (error.response?.status === 401) {
        console.log('[SSOGuard] Silent login failed. Redirecting to Portal...');
        
        const verifier = sessionStorage.getItem('sso_verifier');
        const state = sessionStorage.getItem('sso_state');
        if (!verifier || !state) return next(false);

        const challenge = await generateChallenge(verifier);
        const returnUrl = encodeURIComponent(window.location.origin + callbackPath);
        
        const loginUrl = `${options.portalUrl}/login?client_id=${options.clientId}&code_challenge=${challenge}&state=${state}&redirect_uri=${returnUrl}`;
        
        next(false);
        window.location.href = loginUrl;
        return;
      }
      
      console.error('[SSOGuard] Critical Error:', error);
      return next(false);
    }
  });
}

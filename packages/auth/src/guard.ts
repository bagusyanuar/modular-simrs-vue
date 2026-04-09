import type { Router } from 'vue-router';
import { SessionManager, type AuthSession } from './session';
import { PKCEStorage } from './storage';
import { generateVerifier, generateChallenge } from './pkce';

export interface GuardOptions {
  callbackPath?: string;
  onTokenExchange?: (code: string, verifier: string) => Promise<AuthSession>;
}

/**
 * Creates a centralized SSO Navigation Guard with PKCE support.
 * @param router - Vue Router instance
 * @param options - Custom options for callback path and token exchange
 */
export function createSSOGuard(router: Router, options: GuardOptions = {}) {
  const { callbackPath = '/callback', onTokenExchange } = options;

  router.beforeEach(async (to, _from, next) => {
    
    // 1. Handle SSO Callback
    if (to.path === callbackPath) {
      const code = to.query.code as string;
      if (code) {
        try {
          const verifier = PKCEStorage.getVerifier();
          if (!verifier) throw new Error('PKCE Verifier missing in session storage.');

          // Exchange code for tokens (Real API or Mock)
          const tokens = onTokenExchange 
            ? await onTokenExchange(code, verifier)
            : await defaultTokenExchange(code, verifier);

          SessionManager.save(tokens);
          PKCEStorage.clearVerifier();
          PKCEStorage.clearState();
          
          console.log('✅ SSO Login Successful');
          return next('/');
        } catch (error) {
          console.error('❌ SSO Callback Error:', error);
          return next('/');
        }
      }
    }

    // 2. Auth Check
    if (SessionManager.isAuthenticated()) {
      return next();
    }

    // 3. Trigger Login Redirect
    console.log('🚀 Redirecting to SSO Provider...');
    await triggerLogin();
    
    // Note: window.location.href will prevent next() from being called
  });
}

/**
 * Internal logic to trigger PKCE redirect
 */
async function triggerLogin() {
  const verifier = generateVerifier();
  const challenge = await generateChallenge(verifier);
  
  PKCEStorage.setVerifier(verifier);
  
  const { authServerUrl, clientId, redirectUri } = SessionManager.config;
  
  if (!clientId || !redirectUri) {
    throw new Error('SSO Config Error: clientId and redirectUri must be configured in SessionManager.');
  }

  const baseUrl = authServerUrl.endsWith('/') ? authServerUrl.slice(0, -1) : authServerUrl;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    redirect_uri: redirectUri,
    state: Math.random().toString(36).substring(7)
  });

  window.location.href = `${baseUrl}/authorize?${params.toString()}`;
}

/**
 * Default Mock Token Exchange
 */
async function defaultTokenExchange(code: string, _verifier: string): Promise<AuthSession> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    accessToken: `at-mock-${code}-${Date.now()}`,
    refreshToken: `rt-mock-${code}-${Date.now()}`
  };
}

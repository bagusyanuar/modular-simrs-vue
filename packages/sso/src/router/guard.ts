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
    console.log('🔍 [SSOGuard] Initialized for path:', to.path);
    
    // 1. Handle Callback Route (Tahap C)
    const isCallback = to.path === callbackPath || to.path === `${callbackPath}/`;
    if (isCallback) {
      console.log('🔄 [SSOGuard] Tahap C: Callback Path Detected');
      const code = to.query.code as string;
      const state = to.query.state as string;
      const verifier = sessionStorage.getItem('sso_verifier');
      const savedState = sessionStorage.getItem('sso_state');

      console.log('[SSOGuard] PKCE Data Check:', { 
        hasCode: !!code, 
        hasVerifier: !!verifier, 
        stateMatch: state === savedState,
        queryState: state,
        savedState: savedState
      });

      if (!code || !verifier || state !== savedState) {
        console.warn('[SSOGuard] PKCE Validation Failed! Missing data or state mismatch.');
        return next('/');
      }

      try {
        console.log('[SSOGuard] Attempting Exchange Token...');
        const tokens = await client.exchangeToken({ code, code_verifier: verifier });
        console.log('[SSOGuard] Exchange Token Success! Tokens received.');
        
        const session = {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        };

        SSOSessionManager.save(session);
        if (options.onAuthenticated) options.onAuthenticated(session);
        
        sessionStorage.removeItem('sso_verifier');
        sessionStorage.removeItem('sso_state');
        
        console.log('✅ [SSOGuard] Login Complete! Redirecting to dashboard...');
        return next('/');
      } catch (error: any) {
        const errorData = error?.response?.data || error.message;
        console.error('[SSOGuard] Exchange Token FAILED:', errorData);
        alert('Exchange Token Gagal! Cek Console. Error: ' + JSON.stringify(errorData));
        return next('/');
      }
    }

    console.log('[SSOGuard] Checking Public Meta...', to.meta);
    // 2. Skip for public routes
    if (to.meta?.public) {
      console.log('[SSOGuard] Public Route! Allowing access.');
      return next();
    }

    // 3. Check local session
    const isAuthed = SSOSessionManager.isAuthenticated();
    console.log('[SSOGuard] Local Session Check:', isAuthed);
    
    if (isAuthed) {
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
      
      const silentCode = response.data?.code || response.data?.data?.code;

      if (response.status === 200 && silentCode) {
        const code = silentCode;
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
      // Redirect ke Portal untuk semua kondisi error:
      // - 401: Sesi expired di BE
      // - Network Error: BE belum jalan / CORS issue
      // - Lainnya: Anggap belum login, suruh login dulu
      
      const status = error.response?.status;
      const isNetworkError = !error.response;
      
      console.log(`[SSOGuard] Error (status=${status}, network=${isNetworkError}). Redirecting to Portal...`);
      
      // Ambil dari session, kalau gak ada kita generate baru biar tetep bisa redirect
      let verifier = sessionStorage.getItem('sso_verifier');
      let state = sessionStorage.getItem('sso_state');
      
      if (!verifier || !state) {
        verifier = generateVerifier();
        state = generateRandomString();
        sessionStorage.setItem('sso_verifier', verifier);
        sessionStorage.setItem('sso_state', state);
      }

      const challenge = await generateChallenge(verifier);
      
      // 🛠️ Gunakan URL API biar lebih aman & robust
      const url = new URL(options.portalUrl);
      url.searchParams.set('client_id', options.clientId);
      url.searchParams.set('code_challenge', challenge);
      url.searchParams.set('state', state);
      url.searchParams.set('redirect_uri', options.redirectUri);
      
      const loginUrl = url.toString();
      
      console.log('🚀 [SSOGuard] FINAL REDIRECT URL:', loginUrl);
      
      // Gunakan setTimeout biar event loop Vue Router selesai dulu baru kita paksa pindah halaman
      setTimeout(() => {
        window.location.replace(loginUrl);
      }, 0);
      
      return next(false);
    }
  });
}

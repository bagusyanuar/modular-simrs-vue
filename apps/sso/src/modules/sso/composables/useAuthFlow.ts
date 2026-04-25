import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import {
  SSOSessionManager,
  CookieStorage,
  generateVerifier,
  generateChallenge,
  generateRandomString,
  createSSOClient,
} from '@genrs/sso';
import { getEnv } from '@genrs/utils';
import { AuthorizeUseCase } from '@/core/auth/authorize.usecase';
import { ssoRepository } from '@/infrastructure/auth/sso.repository';

// Instantiate Use Case
const authorizeUseCase = new AuthorizeUseCase(ssoRepository);

const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid Bosku')
    .min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// 🏴‍☠️ Global flag & state biar gak double init dan datanya sinkron di semua komponen
let isAlreadyInitialized = false;
const directParams = {
  client_id: '',
  redirect_uri: '',
  state: '',
  code_challenge: '',
  verifier: '',
};

export function useAuthFlow() {
  const route = useRoute();

  /** Detect if this is a TRULY direct access (ALL OAuth params are missing) */
  function isDirectAccess(): boolean {
    // 🔍 Pake window.location.search langsung biar gak kena timing issue vue-router
    const params = new URLSearchParams(window.location.search);
    
    const hasClientId = !!params.get('client_id');
    const hasRedirectUri = !!params.get('redirect_uri');
    const hasState = !!params.get('state');
    const hasChallenge = !!params.get('code_challenge');

    // Kita cuma anggap direct access kalau 4 parameter utama ini ABSEN.
    // Kalau ada satu aja, berarti ini flow resmi, JANGAN diganggu.
    return !hasClientId && !hasRedirectUri && !hasState && !hasChallenge;
  }

  // 🎭 [INIT] Direct Access Penyamaran
  const isDirect = isDirectAccess();
  if (isDirect && !isAlreadyInitialized) {
    isAlreadyInitialized = true;
    console.log('🎭 [SSOPortal] Direct Access detected. Preparing penyamaran...');
    
    const envDomain = getEnv('VITE_SSO_COOKIE_DOMAIN');
    console.log('🔍 [SSOPortal] Env Domain:', envDomain);

    // 🛠️ Konfigurasi Session Manager - Hardcode buat ngetes
    SSOSessionManager.configure({
      domain: 'neurovi-simulation.test',
      persistentStorage: 'cookie',
      secure: true,
    });

    directParams.verifier = generateVerifier();
    directParams.state = generateRandomString();
    directParams.client_id = getEnv('VITE_SSO_CLIENT_ID');
    directParams.redirect_uri = getEnv('VITE_SSO_REDIRECT_URI');
    
    const domain = getEnv('VITE_SSO_COOKIE_DOMAIN');

    // Simpan ke Cookie segera (Sync)
    CookieStorage.set('sso_verifier', directParams.verifier, { domain, path: '/' });
    CookieStorage.set('sso_state', directParams.state, { domain, path: '/' });

    // Generate challenge & Update URL secara async
    const prepareAsyncParams = async () => {
      directParams.code_challenge = await generateChallenge(directParams.verifier);
      
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('client_id', directParams.client_id);
      newUrl.searchParams.set('redirect_uri', directParams.redirect_uri);
      newUrl.searchParams.set('state', directParams.state);
      newUrl.searchParams.set('code_challenge', directParams.code_challenge);
      window.history.replaceState({}, '', newUrl.toString());
      
      console.log('🎭 [SSOPortal] Penyamaran Ready:', directParams);

      // 🔍 [NEW] Logika Sakti: Cek Shared Cookie langsung!
      const hasSession = SSOSessionManager.hasPersistedSession();
      // 🔍 [TEST] Coba tanam cookie manual tanpa domain
      document.cookie = "portal_test=halo; path=/";
      console.log('🔍 [SSOPortal] Testing for shared session...', {
        hasSession,
        allCookies: document.cookie
      });

      if (hasSession) {
        console.log('✨ [SSOPortal] Shared Session found! Auto-redirecting to App...');
        try {
          const client = createSSOClient({
            baseUrl: getEnv('VITE_SSO_BASE_URL'),
            clientId: directParams.client_id,
            redirectUri: directParams.redirect_uri,
          });

          const response = await client.checkSilentLogin({
            code_challenge: directParams.code_challenge,
            state: directParams.state,
          });

          const silentCode = response.data?.code || response.data?.data?.code;
          if (silentCode) {
            console.log('✅ [SSOPortal] Silent login success. Redirecting with code.');
            return performRedirect(silentCode, directParams.state, directParams.redirect_uri);
          }
        } catch (err: any) {
          console.warn('⚠️ [SSOPortal] Session exists but BE check failed:', err.message);
          window.location.href = directParams.redirect_uri;
          return;
        }
      }

      console.log('ℹ️ [SSOPortal] No active session. Manual login required.');
    };
    
    prepareAsyncParams();
  }

  const { handleSubmit, errors, defineField, isSubmitting, setErrors } =
    useForm({
      validationSchema: toTypedSchema(loginSchema),
      initialValues: { email: '', password: '' },
    });

  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');

  /** Standard OAuth redirect: send code+state back to client app's callback */
  function performRedirect(code: string, state: string, redirectUri: string) {
    const url = new URL(redirectUri);
    url.searchParams.set('code', code);
    url.searchParams.set('state', state);

    // 🕵️‍♂️ Ambil verifier: Coba dari state internal dulu (paling aman), baru storage
    const verifier = directParams.verifier || sessionStorage.getItem('sso_verifier') || CookieStorage.get('sso_verifier');
    
    if (verifier) {
      url.hash = `verifier=${verifier}`;
    }

    window.location.href = url.toString();
  }

  const handleLogin = handleSubmit(async (values) => {
    const urlParams = new URLSearchParams(window.location.search);
    const getParam = (key: string) =>
      urlParams.get(key) || (route.query[key] as string) || (directParams as any)[key];

    // Tunggu sebentar kalau challenge belum kelar digenerate
    if (isDirect && !directParams.code_challenge) {
       directParams.code_challenge = await generateChallenge(directParams.verifier);
    }

    let code_challenge = getParam('code_challenge');
    let state = getParam('state');
    let redirect_uri = getParam('redirect_uri');
    let client_id = getParam('client_id');

    console.log('🚀 [SSOPortal] Attempting login with:', { client_id, redirect_uri, state });

    try {
      const result = await authorizeUseCase.execute({
        ...values,
        code_challenge: code_challenge as string,
        state: state as string,
        client_id: client_id as string,
        redirect_uri: redirect_uri as string,
      });

      // 🔄 Standard OAuth: redirect ke client app's /callback dengan code
      performRedirect(result.code, state as string, redirect_uri as string);
    } catch (e: any) {
      const message =
        e.message || 'Login gagal. Periksa kembali email dan password Bosku.';
      setErrors({ email: message });
    }
  });

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    loading: isSubmitting,
    isAuthenticated: SSOSessionManager.isAuthenticated(),
    isInvalidSSORequest: false,
    handleLogin,
    isDirectAccess,
  };
}

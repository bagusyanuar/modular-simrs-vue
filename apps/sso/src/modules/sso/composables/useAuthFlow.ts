import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import {
  SSOSessionManager,
  CookieStorage,
  generateChallenge,
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

  // 🔄 [INIT] Discovery Redirect: Jika masuk portal tanpa param, lempar ke Master Data
  const isDirect = isDirectAccess();
  if (isDirect && !isAlreadyInitialized) {
    isAlreadyInitialized = true;

    const redirectUri = getEnv('VITE_SSO_REDIRECT_URI') || '';
    const masterDataUrl = redirectUri.split('/callback')[0] || '/';

    console.log(
      '🚀 [SSOPortal] Direct Access. Redirecting to Master Data:',
      masterDataUrl
    );
    window.location.href = masterDataUrl;

    // Return minimal state for mounting
    return {
      isAuthenticated: false,
      loading: true,
      handleLogin: () => {},
    } as any;
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
    const verifier =
      directParams.verifier ||
      sessionStorage.getItem('sso_verifier') ||
      CookieStorage.get('sso_verifier');

    if (verifier) {
      url.hash = `verifier=${verifier}`;
    }

    window.location.href = url.toString();
  }

  const handleLogin = handleSubmit(async (values) => {
    const urlParams = new URLSearchParams(window.location.search);
    const getParam = (key: string) =>
      urlParams.get(key) ||
      (route.query[key] as string) ||
      (directParams as any)[key];

    // Tunggu sebentar kalau challenge belum kelar digenerate
    if (isDirect && !directParams.code_challenge) {
      directParams.code_challenge = await generateChallenge(
        directParams.verifier
      );
    }

    let code_challenge = getParam('code_challenge');
    let state = getParam('state');
    let redirect_uri = getParam('redirect_uri');
    let client_id = getParam('client_id');

    console.log('🚀 [SSOPortal] Attempting login with:', {
      client_id,
      redirect_uri,
      state,
    });

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

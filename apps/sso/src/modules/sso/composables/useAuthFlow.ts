import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { SSOSessionManager, generateVerifier, generateChallenge, generateRandomString } from '@genrs/sso';
import { getEnv } from '@genrs/utils';
import { AuthorizeUseCase } from '@/core/auth/authorize.usecase';
import { ssoRepository } from '@/infrastructure/auth/sso.repository';

// Instantiate Use Case
const authorizeUseCase = new AuthorizeUseCase(ssoRepository);

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid Bosku').min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export function useAuthFlow() {
  const route = useRoute();

  const { handleSubmit, errors, defineField, isSubmitting, setErrors } = useForm({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: { email: '', password: '' },
  });

  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');

  function performRedirect(code: string, state: string, redirectUri: string) {
    const url = new URL(redirectUri);
    url.searchParams.set('code', code);
    url.searchParams.set('state', state);
    window.location.href = url.toString();
  }

  const handleLogin = handleSubmit(async (values) => {
    const urlParams = new URLSearchParams(window.location.search);
    const getParam = (key: string) => (route.query[key] as string) || urlParams.get(key);

    // 🔄 Logic "Self-Auth" jika parameter kosong
    let code_challenge = getParam('code_challenge');
    let state = getParam('state');
    let redirect_uri = getParam('redirect_uri');
    let client_id = getParam('client_id');

    if (!code_challenge || !state || !redirect_uri || !client_id) {
      console.log('🛡️ [SSOPortal] Direct Access detected. Generating Self-Auth parameters...');
      
      const verifier = generateVerifier();
      code_challenge = await generateChallenge(verifier);
      state = generateRandomString();
      client_id = getEnv('VITE_SSO_CLIENT_ID');
      redirect_uri = getEnv('VITE_SSO_REDIRECT_URI');

      // Simpan verifier di session biar /callback nanti bisa nuker token
      sessionStorage.setItem('sso_verifier', verifier);
      sessionStorage.setItem('sso_state', state);
    }

    try {
      // Panggil Use Case dengan data lengkap
      const result = await authorizeUseCase.execute({
        ...values,
        code_challenge: code_challenge as string,
        state: state as string,
        client_id: client_id as string,
        redirect_uri: redirect_uri as string,
      });

      performRedirect(result.code, state as string, redirect_uri as string);
    } catch (e: any) {
      const message = e.message || 'Login gagal. Periksa kembali email dan password Bosku.';
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
    isInvalidSSORequest: false, // Selalu false karena kita support direct login
    handleLogin,
  };
}

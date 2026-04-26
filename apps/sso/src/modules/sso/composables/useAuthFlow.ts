import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import {
  SSOSessionManager,
  generateChallenge,
} from '@genrs/sso';
import { AuthorizeUseCase } from '@/core/auth/authorize.usecase';
import { ssoRepository } from '@/infrastructure/auth/sso.repository';
import { useDirectAccess } from './useDirectAccess';
import { useOAuthParams } from './useOAuthParams';

// Instantiate Use Case
const authorizeUseCase = new AuthorizeUseCase(ssoRepository);

const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid Bosku')
    .min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export interface UseAuthFlowReturn {
  email: Ref<string | undefined>;
  emailAttrs: Record<string, any>;
  password: Ref<string | undefined>;
  passwordAttrs: Record<string, any>;
  errors: ComputedRef<Record<string, string | undefined>>;
  loading: Ref<boolean> | boolean;
  isAuthenticated: boolean;
  isInvalidSSORequest: boolean;
  handleLogin: (e?: Event) => Promise<void | Promise<void> | undefined> | void;
  isDirectAccess: () => boolean;
}

// 🏴‍☠️ Global flag biar gak double init saat redirect
let isAlreadyInitialized = false;

export function useAuthFlow(): UseAuthFlowReturn {
  const { isDirectAccess, handleDiscoveryRedirect } = useDirectAccess();
  const { getOAuthParam, performRedirect, directParams } = useOAuthParams();

  // 🔄 [INIT] Discovery Redirect: Jika masuk portal tanpa param, lempar ke Master Data
  const isDirect = isDirectAccess();
  if (isDirect && !isAlreadyInitialized) {
    isAlreadyInitialized = true;
    handleDiscoveryRedirect();

    // Return minimal state for mounting
    return {
      isAuthenticated: false,
      loading: true,
      handleLogin: async () => {},
      isDirectAccess: () => true,
      email: ref(undefined),
      emailAttrs: {},
      password: ref(undefined),
      passwordAttrs: {},
      errors: computed(() => ({})),
      isInvalidSSORequest: false,
    } as UseAuthFlowReturn;
  }

  const { handleSubmit, errors, defineField, isSubmitting, setErrors } =
    useForm({
      validationSchema: toTypedSchema(loginSchema),
      initialValues: { email: '', password: '' },
    });

  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');

  const handleLogin = handleSubmit(async (values) => {
    // Tunggu sebentar kalau challenge belum kelar digenerate
    if (isDirect && !directParams.code_challenge) {
      directParams.code_challenge = await generateChallenge(
        directParams.verifier
      );
    }

    const code_challenge = getOAuthParam('code_challenge');
    const state = getOAuthParam('state');
    const redirect_uri = getOAuthParam('redirect_uri');
    const client_id = getOAuthParam('client_id');

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

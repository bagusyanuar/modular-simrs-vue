import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { SSOSessionManager } from '@genrs/sso';
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
    const { code_challenge, state, redirect_uri } = route.query;

    if (!code_challenge || !state || !redirect_uri) {
      setErrors({ email: 'Request tidak valid. Parameter SSO tidak lengkap.' });
      return;
    }

    try {
      // Panggil Use Case (Clean Architecture)
      const result = await authorizeUseCase.execute({
        ...values,
        code_challenge: code_challenge as string,
        state: state as string,
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
    handleLogin,
  };
}

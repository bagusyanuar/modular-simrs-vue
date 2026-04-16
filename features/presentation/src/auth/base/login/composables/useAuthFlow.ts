import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { SessionManager } from '@genrs/auth';
import { loginUseCase } from '@genrs/infrastructure/auth/base/login';

// Standard Login Validation Schema
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid Bosku').min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

/**
 * Composable to handle the Modular Auth Flow.
 * Matches the interface expected by the FormLogin component.
 */
export function useAuthFlow() {
  const route = useRoute();

  const { handleSubmit, errors, defineField, isSubmitting, setErrors } = useForm({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const validateConfig = {
    validateOnBlur: true,
    validateOnChange: true,
    validateOnModelUpdate: false,
    validateOnInput: false,
  };

  const [email, emailAttrs] = defineField('email', validateConfig);
  const [password, passwordAttrs] = defineField('password', validateConfig);

  /**
   * Auto-redirect if already logged in
   */
  onMounted(() => {
    if (SessionManager.isAuthenticated() && route.query.return_url) {
      performRedirect();
    }
  });

  function performRedirect() {
    const dashboardUrl = '/dashboard';
    const returnUrl = route.query.return_url as string;
    if (returnUrl) {
      window.location.href = decodeURIComponent(returnUrl);
    } else {
      // Default fallback ke dashboard old-app
      window.location.href = dashboardUrl;
    }
  }

  const handleLogin = handleSubmit(async (values) => {
    try {
      await loginUseCase.execute(values);
      console.log('✅ Login successful. Redirecting...');
      performRedirect();
    } catch (e: any) {
      const message = e.response?.data?.message || 'Login gagal. Periksa kembali email dan password Bosku.';
      setErrors({ email: message }); // Display error on email field or global
      console.error('[useAuthFlow] Login Error:', e);
    }
  });

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    loading: isSubmitting, // Mapping loading to isSubmitting
    isAuthenticated: SessionManager.isAuthenticated(),
    handleLogin,
  };
}

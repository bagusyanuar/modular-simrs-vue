import { authorizeFormValidator } from '@genossys-hospital/infrastructure/auth/base';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { AuthorizeForm } from '@genossys-hospital/core/auth/base';
import {
  authorizeUseCase,
  authorizePortalUseCase,
} from '@genossys-hospital/infrastructure/auth/base';
import type { AxiosError } from 'axios';

export function useLogin() {
  const { handleSubmit, errors, defineField, isSubmitting, setErrors } =
    useForm<AuthorizeForm>({
      validationSchema: toTypedSchema(authorizeFormValidator),
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
   * Handle Submit Logic
   * Dynamically switches between Standard Login and SSO Portal Authorization
   */
  const onSubmit = handleSubmit(async (values) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const clientId = searchParams.get('client_id');
      const redirectUri = searchParams.get('redirect_uri');
      const state = searchParams.get('state');
      const codeChallenge = searchParams.get('code_challenge');

      // 🔍 Determine if we are in SSO Portal Mode
      const isPortalMode = !!(
        clientId &&
        redirectUri &&
        state &&
        codeChallenge
      );

      if (isPortalMode) {
        // 🚀 SSO Portal Flow: Return a 'code' and redirect back
        const { code } = await authorizePortalUseCase.execute({
          ...values,
          clientId: clientId!,
          redirectUri: redirectUri!,
          state: state!,
          codeChallenge: codeChallenge!,
        });

        const target = new URL(redirectUri!);
        target.searchParams.set('code', code);
        target.searchParams.set('state', state!);

        window.location.replace(target.toString());
      } else {
        // 🔑 Standard Login Flow: Normal app login
        await authorizeUseCase.execute(values);
        // Handle post-login redirection for internal app...
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('[useLogin] Login failed:', axiosError);

      // Mapping technical error to UI
      setErrors({
        email: axiosError.response?.data?.message || 'Authentication failed',
      });
    }
  });

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    isSubmitting,
    onSubmit,
  };
}

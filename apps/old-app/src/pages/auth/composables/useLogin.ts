import { useForm } from 'vee-validate';
import type { LoginForm } from '@/core/domains/inputs';
import { loginValidatorSchema } from '@/infrastructure/validators';
import { toTypedSchema } from '@vee-validate/zod';
import { CookieStorage, STORAGE_KEYS } from '@/infrastructure/sources/storage';
// import { loginUseCase } from '@/infrastructure/providers/auth.provider';
export function useLogin() {
  const { handleSubmit, errors, defineField, isSubmitting } =
    useForm<LoginForm>({
      validationSchema: toTypedSchema(loginValidatorSchema),
      initialValues: {
        email: '',
        password: '',
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Dummy Login Simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      CookieStorage.set(STORAGE_KEYS.ACCESS_TOKEN, 'dummy-access-token-v1');
      console.log('Login success:', values);

      // Redirect ke home
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  });

  type FieldOptions = Parameters<typeof defineField>[1];

  const validateConfig: FieldOptions = {
    validateOnBlur: false,
    validateOnChange: false,
    validateOnModelUpdate: false,
    validateOnInput: false,
  };

  const [email, emailAttrs] = defineField<'email'>('email', validateConfig);
  const [password, passwordAttrs] = defineField<'password'>(
    'password',
    validateConfig
  );

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    handleSubmit,
    isSubmitting,
    onSubmit,
  };
}

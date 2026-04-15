import { useForm } from 'vee-validate';
import type { LoginForm } from '@/core/domains/inputs';
import { loginValidatorSchema } from '@/infrastructure/validators';
import { toTypedSchema } from '@vee-validate/zod';
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

  const onSubmit = handleSubmit((values) => {
    console.log(values);
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

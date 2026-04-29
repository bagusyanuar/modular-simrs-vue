import { authorizeFormValidator } from '@genossys-hospital/infrastructure/auth/base'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { AuthorizeForm } from '@genossys-hospital/core/auth/base';

export function useLogin() {
    const { handleSubmit, errors, defineField, isSubmitting, setErrors } = useForm<AuthorizeForm>({
        validationSchema: toTypedSchema(authorizeFormValidator),
        initialValues: {
            email: '',
            password: '',
        },
    })

    const validateConfig = {
        validateOnBlur: true,
        validateOnChange: true,
        validateOnModelUpdate: false,
        validateOnInput: false,
    };

    const [email, emailAttrs] = defineField('email', validateConfig);
    const [password, passwordAttrs] = defineField('password', validateConfig);
    return {
        email,
        emailAttrs,
        password,
        passwordAttrs,
        errors,
    }
}
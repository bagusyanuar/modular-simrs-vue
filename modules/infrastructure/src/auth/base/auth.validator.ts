import { z } from 'zod';
import type { AuthorizeForm } from '@genossys-hospital/core/auth/base';

export const authorizeFormValidator = z.object({
    email: z
        .string()
        .email('Format email tidak valid')
        .min(1, 'Email wajib diisi'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
}) as z.ZodType<AuthorizeForm>;


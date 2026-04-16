import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createInstallationUseCase, updateInstallationUseCase } from '@/infrastructure/providers';
import { installationKeys } from '@/infrastructure/keys';
import type { InstallationForm } from '@/core/domains/inputs';
import { toast } from 'vue-sonner';

export const installationSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(1, 'Kode wajib diisi').max(10, 'Kode maksimal 10 karakter'),
    name: z.string().min(1, 'Nama wajib diisi'),
    isMedical: z.boolean().default(true),
    isActive: z.boolean().default(true),
});

export const useFormInstallation = (emit: (event: 'update:open' | 'success', ...args: any[]) => void) => {
    const queryClient = useQueryClient();

    // 1. Form Validation Setup
    const {
        handleSubmit,
        resetForm,
        setValues,
        errors,
        defineField,
        isSubmitting: isValidating
    } = useForm({
        validationSchema: toTypedSchema(installationSchema),
        initialValues: {
            code: '',
            name: '',
            isMedical: true,
            isActive: true,
        }
    });

    const [code, codeProps] = defineField('code');
    const [name, nameProps] = defineField('name');
    const [isMedical] = defineField('isMedical');
    const [isActive] = defineField('isActive');

    // 2. Mutations
    const createMutation = useMutation({
        mutationFn: (values: InstallationForm) => createInstallationUseCase.execute(values),
        onSuccess: async () => {
            console.log('[useFormInstallation] Create success');
            emit('update:open', false);
            toast.success('Instalasi berhasil ditambahkan');

            await queryClient.invalidateQueries({ queryKey: installationKeys.all() });
            emit('success');
            resetForm();
        },
        onError: (error: any) => {
            console.error('[useFormInstallation] Create error:', error);
            toast.error(error.message || 'Gagal menambahkan instalasi');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: InstallationForm }) =>
            updateInstallationUseCase.execute(id, values),
        onSuccess: async () => {
            console.log('[useFormInstallation] Update success');
            emit('update:open', false);
            toast.success('Instalasi berhasil diperbarui');

            await queryClient.invalidateQueries({ queryKey: installationKeys.all() });
            emit('success');
        },
        onError: (error: any) => {
            console.error('[useFormInstallation] Update error:', error);
            toast.error(error.message || 'Gagal memperbarui instalasi');
        }
    });

    // 3. Submit Handler
    const onSubmit = handleSubmit((values) => {
        if (values.id) {
            updateMutation.mutate({
                id: values.id,
                values: values as InstallationForm
            });
        } else {
            createMutation.mutate(values as InstallationForm);
        }
    });

    const setInitialValues = (data: Partial<InstallationForm> & { id?: string }) => {
        setValues({
            id: data.id,
            code: data.code || '',
            name: data.name || '',
            isMedical: data.isMedical ?? true,
            isActive: data.isActive ?? true,
        });
    };

    return {
        // State
        code,
        codeProps,
        name,
        nameProps,
        isMedical,
        isActive,
        isValidating,
        errors,
        isPending: createMutation.isPending || updateMutation.isPending,

        // Methods
        onSubmit,
        resetForm,
        setInitialValues,
    };
};

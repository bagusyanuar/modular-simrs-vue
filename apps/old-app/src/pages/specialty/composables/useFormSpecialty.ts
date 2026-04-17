import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createSpecialtyUseCase, updateSpecialtyUseCase } from '@/infrastructure/providers';
import { specialtyKeys } from '@/infrastructure/keys';
import type { SpecialtyForm } from '@/core/domains/inputs';
import { toast } from 'vue-sonner';

export const specialtySchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Kode wajib diisi').max(10, 'Kode maksimal 10 karakter'),
  name: z.string().min(1, 'Nama wajib diisi'),
});

export const useFormSpecialty = (emit: (event: 'update:open' | 'success', ...args: any[]) => void) => {
  const queryClient = useQueryClient();

  // 1. Form Validation Setup
  const {
    handleSubmit,
    resetForm,
    setValues,
    errors,
    defineField,
    isSubmitting: isValidating,
  } = useForm({
    validationSchema: toTypedSchema(specialtySchema),
    initialValues: {
      code: '',
      name: '',
    },
  });

  const [code, codeProps] = defineField('code');
  const [name, nameProps] = defineField('name');

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: (values: SpecialtyForm) => createSpecialtyUseCase.execute(values),
    onSuccess: async () => {
      console.log('[useFormSpecialty] Create success');
      emit('update:open', false);
      toast.success('Spesialisasi berhasil ditambahkan');

      await queryClient.invalidateQueries({ queryKey: specialtyKeys.all() });
      emit('success');
      resetForm();
    },
    onError: (error: any) => {
      console.error('[useFormSpecialty] Create error:', error);
      toast.error(error.message || 'Gagal menambahkan spesialisasi');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: SpecialtyForm }) =>
      updateSpecialtyUseCase.execute(id, values),
    onSuccess: async () => {
      console.log('[useFormSpecialty] Update success');
      emit('update:open', false);
      toast.success('Spesialisasi berhasil diperbarui');

      await queryClient.invalidateQueries({ queryKey: specialtyKeys.all() });
      emit('success');
    },
    onError: (error: any) => {
      console.error('[useFormSpecialty] Update error:', error);
      toast.error(error.message || 'Gagal memperbarui spesialisasi');
    },
  });

  // 3. Submit Handler
  const onSubmit = handleSubmit((values) => {
    if (values.id) {
      updateMutation.mutate({
        id: values.id,
        values: values as SpecialtyForm,
      });
    } else {
      createMutation.mutate(values as SpecialtyForm);
    }
  });

  const setInitialValues = (data: Partial<SpecialtyForm> & { id?: string }) => {
    setValues({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
    });
  };

  return {
    // State
    code,
    codeProps,
    name,
    nameProps,
    isValidating,
    errors,
    isPending: createMutation.isPending || updateMutation.isPending,

    // Methods
    onSubmit,
    resetForm,
    setInitialValues,
  };
};

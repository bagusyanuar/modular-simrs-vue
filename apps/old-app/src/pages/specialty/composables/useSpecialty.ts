import { useQuery } from '@tanstack/vue-query';
import { getSpecialtiesUseCase } from '@/infrastructure/providers';
import { specialtyKeys } from '@/infrastructure/keys';
import type { SpecialtyParams } from '@/core/domains/inputs';
import { type Ref, computed } from 'vue';

export const useSpecialty = (params: Ref<SpecialtyParams>) => {
  const {
    data: specialties,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: computed(() => specialtyKeys.all(params.value)),
    queryFn: () => getSpecialtiesUseCase.execute(params.value),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    specialties,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

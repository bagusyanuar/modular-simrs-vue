import { useQuery } from '@tanstack/vue-query';
import { getInstallationsUseCase } from '@/infrastructure/providers';
import { installationKeys } from '@/infrastructure/keys';
import type { InstallationParams } from '@/core/domains/inputs';
import { type Ref, computed } from 'vue';

export const useInstallation = (params: Ref<InstallationParams>) => {
    const {
        data: installations,
        isLoading,
        isFetching,
        error,
        refetch
    } = useQuery({
        // Gunakan computed agar queryKey tetap reaktif saat params berubah
        queryKey: computed(() => installationKeys.all(params.value)),
        queryFn: () => getInstallationsUseCase.execute(params.value),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        installations,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};

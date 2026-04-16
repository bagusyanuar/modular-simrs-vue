import { useQuery } from '@tanstack/vue-query';
import { getInstallationsUseCase } from '@/infrastructure/providers';
import type { InstallationParams } from '@/core/domains/inputs';
import type { Ref } from 'vue';

export const useInstallation = (params: Ref<InstallationParams>) => {
    const {
        data: installations,
        isLoading,
        isFetching,
        error,
        refetch
    } = useQuery({
        queryKey: ['installations', params],
        queryFn: () => getInstallationsUseCase.execute(params.value),
        // Data dummy atau mock aslinya nanti diganti balikan API di repository
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        installations,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};

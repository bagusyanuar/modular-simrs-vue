import { InstallationParams } from '@/core/domains/inputs';

export const installationKeys = {
    all: (params?: InstallationParams) => {
        return !params
            ? (['simrs', 'installation', 'all'] as const)
            : (['simrs', 'installation', 'all', params.search, params.page, params.limit, params.sortBy, params.sortOrder] as const);
    },
    detail: (id: string) => (['simrs', 'installation', 'detail', id] as const),
};
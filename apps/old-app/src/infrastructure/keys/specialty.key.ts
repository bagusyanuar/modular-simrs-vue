import { SpecialtyParams } from '@/core/domains/inputs';

export const specialtyKeys = {
  all: (params?: SpecialtyParams) => {
    return !params
      ? (['simrs', 'specialty', 'all'] as const)
      : ([
          'simrs',
          'specialty',
          'all',
          params.search,
          params.page,
          params.limit,
          params.sortBy,
          params.sortOrder,
        ] as const);
  },
  detail: (id: string) => (['simrs', 'specialty', 'detail', id] as const),
};

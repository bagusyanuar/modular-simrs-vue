import { UnitParams } from '@genrs/core/simrs/base/unit';

export const unitKeys = {
  all: (params?: UnitParams) => {
    return !params
      ? (['simrs', 'unit', 'all'] as const)
      : (['simrs', 'unit', 'all', params.search] as const);
  },
};

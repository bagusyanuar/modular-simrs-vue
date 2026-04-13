import { UnitForm, UnitParams } from '@genrs/core/simrs/base/unit';
import { UnitQuery, UnitRequest } from './unit.schema';

export const mapUnitParamsToQuery = (params: UnitParams): UnitQuery => {
  return {
    search: params.search,
  };
};

export const mapUnitFormToRequest = (form: UnitForm): UnitRequest => {
  return {
    code: form.code,
    name: form.name,
  };
};

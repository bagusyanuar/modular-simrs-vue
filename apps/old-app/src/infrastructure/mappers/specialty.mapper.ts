import type { SpecialtyModel } from '@/core/domains/models';
import type { SpecialtyForm, SpecialtyParams } from '@/core/domains/inputs';
import type {
  SpecialtyQuery,
  SpecialtyRequest,
  SpecialtyResponse,
} from '../schemas/specialty.schema';

export const mapSpecialtyParamsToQuery = (
  params: SpecialtyParams
): SpecialtyQuery => {
  return {
    search: params.search,
    page: params.page,
    limit: params.limit,
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  };
};

export const mapSpecialtyFormToRequest = (
  form: SpecialtyForm
): SpecialtyRequest => {
  return {
    code: form.code,
    name: form.name,
  };
};

export const mapSpecialtyResponseToModel = (res: SpecialtyResponse): SpecialtyModel => {
  return {
    id: res.id,
    code: res.code,
    name: res.name,
    createdAt: res.created_at,
    updatedAt: res.updated_at,
    deletedAt: null,
  };
};

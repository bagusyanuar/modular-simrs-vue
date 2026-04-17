import type { InstallationModel } from '@/core/domains/models';
import type { InstallationForm, InstallationParams } from '@/core/domains/inputs';
import type { InstallationQuery, InstallationRequest, InstallationResponse } from '../schemas/installation.schema';

export const mapInstallationParamsToQuery = (params: InstallationParams): InstallationQuery => {
  return {
    search: params.search,
    page: params.page,
    limit: params.limit,
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  };
};

export const mapInstallationFormToRequest = (form: InstallationForm): InstallationRequest => {
  return {
    code: form.code,
    name: form.name,
    is_medical: form.isMedical,
    is_active: form.isActive,
  };
};

export const mapInstallationResponseToModel = (res: InstallationResponse): InstallationModel => {
  return {
    id: res.id,
    code: res.code,
    name: res.name,
    isMedical: res.is_medical,
    isActive: res.is_active,
    createdAt: res.created_at,
    updatedAt: res.updated_at,
    deletedAt: null,
  };
};

import api from '../sources/api/api';
import type { SpecialtyForm, SpecialtyParams } from '@/core/domains/inputs';
import type { SpecialtyModel } from '@/core/domains/models';
import type { SpecialtyRepository } from '@/core/repositories';
import type { APIResponse } from '../schemas/api.schema';
import type { SpecialtyQuery, SpecialtyRequest, SpecialtyResponse } from '../schemas/specialty.schema';
import {
  mapSpecialtyFormToRequest,
  mapSpecialtyParamsToQuery,
  mapSpecialtyResponseToModel,
} from '../mappers/specialty.mapper';

export class ApiSpecialtyRepository implements SpecialtyRepository {
  private readonly path = '/specialties';

  async find(params: SpecialtyParams): Promise<SpecialtyModel[]> {
    try {
      const query: SpecialtyQuery = mapSpecialtyParamsToQuery(params);
      const res = await api.get<APIResponse<SpecialtyResponse[]>>(this.path, { params: query });
      return (res.data.data || []).map(mapSpecialtyResponseToModel);
    } catch (error) {
      console.error('[ApiSpecialtyRepository] find error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<SpecialtyModel> {
    try {
      const res = await api.get<APIResponse<SpecialtyResponse>>(`${this.path}/${id}`);
      if (!res.data.data) throw new Error('Specialty not found');
      return mapSpecialtyResponseToModel(res.data.data);
    } catch (error) {
      console.error('[ApiSpecialtyRepository] findById error:', error);
      throw error;
    }
  }

  async create(form: SpecialtyForm): Promise<SpecialtyModel> {
    try {
      const request: SpecialtyRequest = mapSpecialtyFormToRequest(form);
      const res = await api.post<APIResponse<SpecialtyResponse>>(this.path, request);
      if (!res.data.data) throw new Error('Failed to create specialty');
      return mapSpecialtyResponseToModel(res.data.data);
    } catch (error) {
      console.error('[ApiSpecialtyRepository] create error:', error);
      throw error;
    }
  }

  async update(id: string, form: SpecialtyForm): Promise<SpecialtyModel> {
    try {
      const request: SpecialtyRequest = mapSpecialtyFormToRequest(form);
      const res = await api.put<APIResponse<SpecialtyResponse>>(`${this.path}/${id}`, request);

      if (!res.data.data) {
        console.warn('[ApiSpecialtyRepository] Update success but no data returned from server');
        return {
          id,
          ...form,
          createdAt: '',
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        } as SpecialtyModel;
      }

      return mapSpecialtyResponseToModel(res.data.data);
    } catch (error) {
      console.error('[ApiSpecialtyRepository] update error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.path}/${id}`);
    } catch (error) {
      console.error('[ApiSpecialtyRepository] delete error:', error);
      throw error;
    }
  }
}

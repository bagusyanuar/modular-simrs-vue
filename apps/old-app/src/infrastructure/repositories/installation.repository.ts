import api from '../sources/api/api';
import type { InstallationForm, InstallationParams } from '@/core/domains/inputs';
import type { InstallationModel } from '@/core/domains/models';
import type { InstallationRepository } from '@/core/repositories';
import type { APIResponse } from '../schemas/api.schema';
import type { InstallationQuery, InstallationRequest, InstallationResponse } from '../schemas/installation.schema';
import {
    mapInstallationFormToRequest,
    mapInstallationParamsToQuery,
    mapResponseToModel
} from '../mappers/installation.mapper';

export class ApiInstallationRepository implements InstallationRepository {
    private readonly path = '/installations';

    async find(params: InstallationParams): Promise<InstallationModel[]> {
        try {
            const query: InstallationQuery = mapInstallationParamsToQuery(params);
            const res = await api.get<APIResponse<InstallationResponse[]>>(this.path, { params: query });
            return (res.data.data || []).map(mapResponseToModel);
        } catch (error) {
            console.error('[ApiInstallationRepository] find error:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<InstallationModel> {
        try {
            const res = await api.get<APIResponse<InstallationResponse>>(`${this.path}/${id}`);
            if (!res.data.data) throw new Error('Installation not found');
            return mapResponseToModel(res.data.data);
        } catch (error) {
            console.error('[ApiInstallationRepository] findById error:', error);
            throw error;
        }
    }

    async create(form: InstallationForm): Promise<InstallationModel> {
        try {
            const request: InstallationRequest = mapInstallationFormToRequest(form);
            const res = await api.post<APIResponse<InstallationResponse>>(this.path, request);
            if (!res.data.data) throw new Error('Failed to create installation');
            return mapResponseToModel(res.data.data);
        } catch (error) {
            console.error('[ApiInstallationRepository] create error:', error);
            throw error;
        }
    }

    async update(id: string, form: InstallationForm): Promise<InstallationModel> {
        try {
            const request: InstallationRequest = mapInstallationFormToRequest(form);
            const res = await api.put<APIResponse<InstallationResponse>>(`${this.path}/${id}`, request);
            if (!res.data.data) throw new Error('Failed to update installation');
            return mapResponseToModel(res.data.data);
        } catch (error) {
            console.error('[ApiInstallationRepository] update error:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`${this.path}/${id}`);
        } catch (error) {
            console.error('[ApiInstallationRepository] delete error:', error);
            throw error;
        }
    }
}

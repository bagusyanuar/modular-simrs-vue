import { InstallationModel } from '@/core/domains/models'
import { InstallationForm, InstallationParams } from '@/core/domains/inputs'

export interface InstallationRepository {
    find(params: InstallationParams): Promise<InstallationModel[]>;
    findById(id: string): Promise<InstallationModel>;
    create(form: InstallationForm): Promise<InstallationModel>;
    update(id: string, form: InstallationForm): Promise<InstallationModel>;
    delete(id: string): Promise<void>;
}
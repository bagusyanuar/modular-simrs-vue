export interface InstallationModel {
    id: string;
    code: string;
    name: string;
    isMedical: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
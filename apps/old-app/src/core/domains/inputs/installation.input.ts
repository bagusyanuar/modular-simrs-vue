export interface InstallationForm {
    code: string;
    name: string;
    isMedical: boolean;
    isActive: boolean;
}

export interface InstallationParams {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
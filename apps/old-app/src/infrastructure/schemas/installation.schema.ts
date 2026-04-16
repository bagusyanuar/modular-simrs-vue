export interface InstallationQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface InstallationRequest {
  code: string;
  name: string;
  is_medical: boolean;
  is_active: boolean;
}

export interface InstallationResponse {
  id: string;
  code: string;
  name: string;
  is_medical: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

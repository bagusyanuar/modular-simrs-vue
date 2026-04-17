export interface SpecialtyQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SpecialtyRequest {
  code: string;
  name: string;
}

export interface SpecialtyResponse {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

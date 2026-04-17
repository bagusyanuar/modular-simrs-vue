export interface SpecialtyForm {
  code: string;
  name: string;
}


export interface SpecialtyParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

import type { PaginationParam } from '../libs';

export interface UnitParams extends PaginationParam {
  search?: string;
}

export interface UnitForm {
  code: string;
  name: string;
}

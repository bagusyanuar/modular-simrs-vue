import { SpecialtyModel } from '@/core/domains/models';
import { SpecialtyForm, SpecialtyParams } from '@/core/domains/inputs';

export interface SpecialtyRepository {
  find(params: SpecialtyParams): Promise<SpecialtyModel[]>;
  findById(id: string): Promise<SpecialtyModel>;
  create(form: SpecialtyForm): Promise<SpecialtyModel>;
  update(id: string, form: SpecialtyForm): Promise<SpecialtyModel>;
  delete(id: string): Promise<void>;
}

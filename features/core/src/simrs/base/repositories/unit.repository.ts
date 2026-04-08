import type { Unit } from '../domains/models/unit.model';
import type { UnitForm, UnitParams } from '../domains/inputs/unit.input';

export interface UnitRepository {
  find(params: UnitParams): Promise<Unit[]>;
  findById(id: string): Promise<Unit>;
  create(form: UnitForm): Promise<Unit>;
}

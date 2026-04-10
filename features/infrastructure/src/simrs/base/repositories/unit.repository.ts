import { UnitForm, UnitParams } from '@genrs/core/simrs/base/domains/inputs';
import { Unit } from '@genrs/core/simrs/base/domains/models';
import { UnitRepository } from '@genrs/core/simrs/base/repositories';

export class ApiUnitRepository implements UnitRepository {
  find(params: UnitParams): Promise<Unit[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Unit> {
    throw new Error('Method not implemented.');
  }
  create(form: UnitForm): Promise<Unit> {
    throw new Error('Method not implemented.');
  }
  update(id: string, form: UnitForm): Promise<Unit> {
    throw new Error('Method not implemented.');
    // axios
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

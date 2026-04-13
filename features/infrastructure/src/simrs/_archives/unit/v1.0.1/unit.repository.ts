import { UnitForm, UnitParams, Unit, UnitRepository } from '@genrs/core/simrs/base/unit';

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

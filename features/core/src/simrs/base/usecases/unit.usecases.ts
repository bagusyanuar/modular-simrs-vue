import type { Unit } from '../domains/models/unit.model';
import type { UnitForm, UnitParams } from '../domains/inputs/unit.input';
import type { UnitRepository } from '../repositories/unit.repository';

export class GetUnits {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(params: UnitParams): Promise<Unit[]> {
    return this.unitRepository.find(params);
  }
}

export class GetUnitById {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(id: string): Promise<Unit> {
    return this.unitRepository.findById(id);
  }
}

export class CreateUnit {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(form: UnitForm): Promise<Unit> {
    return this.unitRepository.create(form);
  }
}

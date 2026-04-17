import type { SpecialtyModel } from '@/core/domains/models';
import type { SpecialtyForm, SpecialtyParams } from '@/core/domains/inputs';
import type { SpecialtyRepository } from '@/core/repositories';

export class GetSpecialties {
  private readonly repository: SpecialtyRepository;

  constructor(repository: SpecialtyRepository) {
    this.repository = repository;
  }

  async execute(params: SpecialtyParams): Promise<SpecialtyModel[]> {
    return this.repository.find(params);
  }
}

export class GetSpecialtyById {
  private readonly repository: SpecialtyRepository;

  constructor(repository: SpecialtyRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<SpecialtyModel> {
    return this.repository.findById(id);
  }
}

export class CreateSpecialty {
  private readonly repository: SpecialtyRepository;

  constructor(repository: SpecialtyRepository) {
    this.repository = repository;
  }

  async execute(form: SpecialtyForm): Promise<SpecialtyModel> {
    return this.repository.create(form);
  }
}

export class UpdateSpecialty {
  private readonly repository: SpecialtyRepository;

  constructor(repository: SpecialtyRepository) {
    this.repository = repository;
  }

  async execute(id: string, form: SpecialtyForm): Promise<SpecialtyModel> {
    return this.repository.update(id, form);
  }
}

export class DeleteSpecialty {
  private readonly repository: SpecialtyRepository;

  constructor(repository: SpecialtyRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

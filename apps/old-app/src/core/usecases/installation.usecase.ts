import type { InstallationModel } from '@/core/domains/models';
import type { InstallationForm, InstallationParams } from '@/core/domains/inputs';
import type { InstallationRepository } from '@/core/repositories';

export class GetInstallations {
  private readonly repository: InstallationRepository;

  constructor(repository: InstallationRepository) {
    this.repository = repository;
  }

  async execute(params: InstallationParams): Promise<InstallationModel[]> {
    return this.repository.find(params);
  }
}

export class GetInstallationById {
  private readonly repository: InstallationRepository;

  constructor(repository: InstallationRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<InstallationModel> {
    return this.repository.findById(id);
  }
}

export class CreateInstallation {
  private readonly repository: InstallationRepository;

  constructor(repository: InstallationRepository) {
    this.repository = repository;
  }

  async execute(form: InstallationForm): Promise<InstallationModel> {
    return this.repository.create(form);
  }
}

export class UpdateInstallation {
  private readonly repository: InstallationRepository;

  constructor(repository: InstallationRepository) {
    this.repository = repository;
  }

  async execute(id: string, form: InstallationForm): Promise<InstallationModel> {
    return this.repository.update(id, form);
  }
}

export class DeleteInstallation {
  private readonly repository: InstallationRepository;

  constructor(repository: InstallationRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

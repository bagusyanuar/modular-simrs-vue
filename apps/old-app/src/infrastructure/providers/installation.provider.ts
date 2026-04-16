import { 
  GetInstallations, 
  GetInstallationById, 
  CreateInstallation, 
  UpdateInstallation, 
  DeleteInstallation 
} from '@/core/usecases';
import { ApiInstallationRepository } from '../repositories/installation.repository';

/**
 * Dependency Injection Provider for Installation Module
 * Centralized instantiation of repositories and usecases.
 */

const installationRepository = new ApiInstallationRepository();

export const getInstallationsUseCase = new GetInstallations(installationRepository);
export const getInstallationByIdUseCase = new GetInstallationById(installationRepository);
export const createInstallationUseCase = new CreateInstallation(installationRepository);
export const updateInstallationUseCase = new UpdateInstallation(installationRepository);
export const deleteInstallationUseCase = new DeleteInstallation(installationRepository);

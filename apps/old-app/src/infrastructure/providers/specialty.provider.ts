import {
  GetSpecialties,
  GetSpecialtyById,
  CreateSpecialty,
  UpdateSpecialty,
  DeleteSpecialty,
} from '@/core/usecases';
import { ApiSpecialtyRepository } from '../repositories/specialty.repository';

/**
 * Dependency Injection Provider for Specialty Module
 * Centralized instantiation of repositories and usecases.
 */

const specialtyRepository = new ApiSpecialtyRepository();

export const getSpecialtiesUseCase = new GetSpecialties(specialtyRepository);
export const getSpecialtyByIdUseCase = new GetSpecialtyById(specialtyRepository);
export const createSpecialtyUseCase = new CreateSpecialty(specialtyRepository);
export const updateSpecialtyUseCase = new UpdateSpecialty(specialtyRepository);
export const deleteSpecialtyUseCase = new DeleteSpecialty(specialtyRepository);

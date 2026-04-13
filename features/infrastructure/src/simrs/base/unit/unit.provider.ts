import { GetUnits, GetUnitById, CreateUnit } from '@genrs/core/simrs/base/unit';
import { ApiUnitRepository } from './unit.repository';

/**
 * Dependency Injection Provider for Unit Module
 * Centralized instantiation of repositories and usecases.
 */

const unitRepository = new ApiUnitRepository();

export const getUnitsUseCase = new GetUnits(unitRepository);
export const getUnitByIdUseCase = new GetUnitById(unitRepository);
export const createUnitUseCase = new CreateUnit(unitRepository);

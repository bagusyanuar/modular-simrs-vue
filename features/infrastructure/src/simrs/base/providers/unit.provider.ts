import {
  GetUnits,
  CreateUnit,
  GetUnitById,
} from '@genrs/core/simrs/base/usecases/unit.usecases';
import { ApiUnitRepository } from '../repositories/unit.repository';

const unitRepository = new ApiUnitRepository();
export const getUnitsUsecase = new GetUnits(unitRepository);
export const getUnitByIdUsecase = new GetUnitById(unitRepository);
export const createUnitUsecase = new CreateUnit(unitRepository);

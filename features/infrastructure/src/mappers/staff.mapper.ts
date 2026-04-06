import type { StaffForm } from '../../../core/src/simrs/domains/inputs/staff.input';
import type { StaffRequest } from '../schemas/staff.schema';

/**
 * Maps a StaffForm domain input to a StaffRequest infrastructure schema.
 * 
 * @param form - The staff form data from the domain layer.
 * @returns The staff request data formatted for the infrastructure layer.
 */
export const mapStaffFormToRequest = (form: StaffForm): StaffRequest => {
  return {
    name: form.name,
    password: form.password,
    nip: form.nip,
  };
};

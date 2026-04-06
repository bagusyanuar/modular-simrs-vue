export interface StaffResponse {
  id: string;
  isActive: boolean;
  name: string;
  nip: string;
  phoneNo: string;
}

export interface StaffRequest {
  name: string;
  password: string;
  nip: string;
}

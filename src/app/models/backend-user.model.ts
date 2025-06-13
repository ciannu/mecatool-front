import { Role } from './role.model';

export interface BackendUserDTO {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
} 
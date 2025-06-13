import { Role } from './role.model';

export interface BackendUserDTO {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: Role; // This will now be the Role object from the backend
  createdAt?: string;
  updatedAt?: string;
} 
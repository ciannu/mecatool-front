export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleId: number;
  roleName?: string;
  createdAt?: string;
  updatedAt?: string;
} 
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Add optional password field
  roleId: number; // Assuming we will work with role IDs on the frontend for user creation/update
  roleName?: string; // To display the role name
  createdAt?: string;
  updatedAt?: string;
} 
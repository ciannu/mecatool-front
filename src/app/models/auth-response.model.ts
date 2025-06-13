import { BackendUserDTO } from './backend-user.model';

export interface AuthResponse {
  token: string;
  user: BackendUserDTO;
} 
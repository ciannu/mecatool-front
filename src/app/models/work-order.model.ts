import { Vehicle } from './vehicle.model';

export interface WorkOrderDTO {
  id?: number;
  vehicleId: number;
  vehicle?: Vehicle;
  status: string;
  startDate: Date;
  endDate?: Date;
  mechanicIds: number[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalPrice?: number;
} 
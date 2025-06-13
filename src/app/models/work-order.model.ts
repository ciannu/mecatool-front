export interface WorkOrderDTO {
  id?: number;
  vehicleId: number;
  status: string;
  startDate: Date;
  endDate?: Date;
  mechanicIds: number[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 
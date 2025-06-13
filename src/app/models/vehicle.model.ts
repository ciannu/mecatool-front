export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  client: {
    id: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

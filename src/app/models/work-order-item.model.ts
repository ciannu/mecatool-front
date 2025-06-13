export interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  description?: string;
}

export interface WorkOrderItem {
  id?: number;
  inventoryItemId: number;
  quantity: number;
  price: number;
  workOrderId?: number;
} 
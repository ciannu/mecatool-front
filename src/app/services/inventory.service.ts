import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { InventoryItem, WorkOrderItem } from '../models/work-order-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory-items`;
  private workOrderItemsUrl = `${environment.apiUrl}/work-orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }

  create(item: InventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item);
  }

  update(id: number, item: InventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Work Order Items
  getWorkOrderItems(workOrderId: number): Observable<WorkOrderItem[]> {
    return this.http.get<WorkOrderItem[]>(`${this.workOrderItemsUrl}/${workOrderId}/items`);
  }

  addWorkOrderItem(workOrderId: number, item: WorkOrderItem): Observable<WorkOrderItem> {
    return this.http.post<WorkOrderItem>(`${this.apiUrl}/work-orders/${workOrderId}/items`, item);
  }

  updateWorkOrderItem(workOrderId: number, itemId: number, item: WorkOrderItem): Observable<WorkOrderItem> {
    return this.http.put<WorkOrderItem>(`${this.apiUrl}/work-orders/${workOrderId}/items/${itemId}`, item);
  }

  deleteWorkOrderItem(workOrderId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/work-orders/${workOrderId}/items/${itemId}`);
  }

  // Stock management
  getAvailableStock(itemId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${itemId}/stock`);
  }

  hasEnoughStock(itemId: number, quantity: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${itemId}/has-stock?quantity=${quantity}`);
  }

  decreaseStock(id: number, quantity: number): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/${id}/decrease-stock`, null, { params: { quantity: quantity.toString() } });
  }
} 
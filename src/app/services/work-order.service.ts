import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WorkOrderItem } from '../models/work-order-item.model';

export enum WorkOrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface WorkOrder {
  id?: number;
  vehicleId: number;
  description: string;
  status: WorkOrderStatus;
  startDate: Date;
  endDate?: Date;
  total?: number;
  mechanicIds: number[];
  workOrderItems?: WorkOrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private apiUrl = `${environment.apiUrl}/work-orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(this.apiUrl);
  }

  getById(id: number): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.apiUrl}/${id}`);
  }

  create(workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.apiUrl, workOrder);
  }

  update(id: number, workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http.put<WorkOrder>(`${this.apiUrl}/${id}`, workOrder);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: WorkOrderStatus): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  assignMechanics(id: number, mechanicIds: number[]): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(
      `${this.apiUrl}/${id}/mechanics`,
      mechanicIds
    );
  }

  filter(
    status?: WorkOrderStatus,
    vehicleId?: number,
    mechanicId?: number
  ): Observable<WorkOrder[]> {
    let url = `${this.apiUrl}/filter?`;
    if (status) url += `status=${status}&`;
    if (vehicleId) url += `vehicleId=${vehicleId}&`;
    if (mechanicId) url += `mechanicId=${mechanicId}`;
    return this.http.get<WorkOrder[]>(url);
  }

  getWorkOrderItems(workOrderId: number): Observable<WorkOrderItem[]> {
    return this.http.get<WorkOrderItem[]>(`${this.apiUrl}/${workOrderId}/items`);
  }

  addWorkOrderItem(workOrderId: number, item: WorkOrderItem): Observable<WorkOrderItem> {
    return this.http.post<WorkOrderItem>(`${this.apiUrl}/${workOrderId}/items`, item).pipe(
      catchError(this._handleError)
    );
  }

  updateWorkOrderItem(workOrderId: number, itemId: number, item: WorkOrderItem): Observable<WorkOrderItem> {
    return this.http.put<WorkOrderItem>(`${this.apiUrl}/${workOrderId}/items/${itemId}`, item).pipe(
      catchError(this._handleError)
    );
  }

  deleteWorkOrderItem(workOrderId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workOrderId}/items/${itemId}`).pipe(
      catchError(this._handleError)
    );
  }

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 400 && error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status === 404 && error.error && error.error.message) {
        errorMessage = `Not Found: ${error.error.message}`;
      } else if (error.status === 409 && error.error && error.error.message) { // Conflict
        errorMessage = `Conflict: ${error.error.message}`;
      } else if (error.status === 422 && error.error && error.error.message) { // Unprocessable Entity
        errorMessage = `Validation Error: ${error.error.message}`;
      } else if (error.status === 500 && error.error && error.error.message) {
        errorMessage = `Server Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

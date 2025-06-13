import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface Payment {
  id?: number;
  invoiceId: number;
  amount: number;
  paymentDate: Date;
  method: string;
  note?: string;
}

export interface Invoice {
  id?: number;
  workOrderId: number;
  issueDate: Date;
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
  payments: Payment[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  createFromWorkOrder(workOrderId: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/from-work-order/${workOrderId}`, {});
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getByStatus(status: InvoiceStatus): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/status/${status}`);
  }

  getByWorkOrder(workOrderId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/work-order/${workOrderId}`);
  }

  addPayment(invoiceId: number, payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${invoiceId}/payments`, payment);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
} 
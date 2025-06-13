import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Mechanic {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  private apiUrl = `${environment.apiUrl}/mechanics`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(this.apiUrl);
  }

  getById(id: number): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/${id}`);
  }

  create(mechanic: Mechanic): Observable<Mechanic> {
    return this.http.post<Mechanic>(this.apiUrl, mechanic);
  }

  update(id: number, mechanic: Mechanic): Observable<Mechanic> {
    return this.http.put<Mechanic>(`${this.apiUrl}/${id}`, mechanic);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMechanicsByIds(ids: number[]): Observable<Mechanic[]> {
    return this.http.post<Mechanic[]>(`${this.apiUrl}/by-ids`, ids);
  }
} 
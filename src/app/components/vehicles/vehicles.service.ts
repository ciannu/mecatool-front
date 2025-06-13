import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehicles(query: string = ''): Observable<Vehicle[]> {
    const url = query ? `${this.apiUrl}/search?query=${query}` : this.apiUrl;
    return this.http.get<Vehicle[]>(url);
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  createVehicle(
    vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${vehicle.id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

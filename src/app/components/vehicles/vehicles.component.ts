import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from '../../models/vehicle.model';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  clientsMap: Map<number, string> = new Map();
  loading = true;
  error: string | null = null;
  searchControl = new FormControl('');
  isAdmin = false;

  constructor(
    private vehiclesService: VehiclesService,
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.setupSearch();
    this.isAdmin = this.authService.getCurrentUserRole()?.toUpperCase() === 'ADMIN';
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.loadVehicles(query || '');
      });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients: Client[]) => {
        clients.forEach(client => {
          this.clientsMap.set(client.id, `${client.firstName} ${client.lastName}`);
        });
        this.loadVehicles();
      },
      error: (err: any) => {
        console.error('Error loading clients:', err);
        this.error = 'Error loading clients';
        this.loading = false;
      }
    });
  }

  loadVehicles(query: string = ''): void {
    this.vehiclesService.getVehicles(query).subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading vehicles';
        this.loading = false;
        console.error('Error loading vehicles:', err);
      }
    });
  }

  getClientName(clientId: number): string {
    return this.clientsMap.get(clientId) || 'Unknown Client';
  }

  deleteVehicle(id: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehiclesService.deleteVehicle(id).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
          alert('Error deleting vehicle');
        }
      });
    }
  }
} 
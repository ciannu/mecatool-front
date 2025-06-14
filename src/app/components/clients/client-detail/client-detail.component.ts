import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../services/client.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Client } from '../../../models/client.model';
import { Vehicle } from '../../../models/vehicle.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  clientVehicles: Vehicle[] = [];
  displayedColumns: string[] = ['brand', 'model', 'licensePlate', 'year'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (clientId) {
      this.loadClient(clientId);
      this.loadClientVehicles(clientId);
    }
  }

  loadClient(clientId: number): void {
    this.clientService.getById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
      },
      error: (err: any) => {
        console.error('Error loading client:', err);
        this.router.navigate(['/clients']);
      }
    });
  }

  loadClientVehicles(clientId: number): void {
    this.vehicleService.getVehiclesByClient(clientId).subscribe({
      next: (vehicles: Vehicle[]) => {
        this.clientVehicles = vehicles;
      },
      error: (err: any) => {
        console.error('Error loading client vehicles:', err);
      }
    });
  }

  onEdit(): void {
    if (this.client) {
      this.router.navigate(['/clients', this.client.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/clients']);
  }
} 
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientService, Client } from '../../services/client.service';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkOrderDTO } from '../../models/work-order.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatCardModule, MatIconModule, DatePipe],
})
export class HomeComponent implements OnInit {
  totalClients: number = 0;
  totalVehicles: number = 0;
  totalWorkOrders: number = 0;
  latestClient: Client | undefined;
  latestWorkOrder: WorkOrderDTO | undefined;

  constructor(
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private workOrderService: WorkOrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.clientService.getTotalClients().subscribe(count => {
      this.totalClients = count;
    });

    this.clientService.getLatestClient().subscribe(client => {
      this.latestClient = client;
    });

    this.vehicleService.getTotalVehicles().subscribe(count => {
      this.totalVehicles = count;
    });

    this.workOrderService.getTotalWorkOrders().subscribe(count => {
      this.totalWorkOrders = count;
    });

    this.workOrderService.getLatestWorkOrder().subscribe(workOrder => {
      this.latestWorkOrder = workOrder;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { WorkOrderService, WorkOrder, WorkOrderStatus } from '../../../services/work-order.service';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { MechanicService, Mechanic } from '../../../services/mechanic.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { WorkOrderDTO } from '../../../models/work-order.model';

@Component({
  selector: 'app-work-orders-list',
  templateUrl: './work-orders-list.component.html',
  styleUrls: ['./work-orders-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
    DatePipe,
    MatDialogModule
  ]
})
export class WorkOrdersListComponent implements OnInit {
  workOrders: WorkOrderDTO[] = [];
  vehicles: Map<number, Vehicle> = new Map();
  mechanics: Map<number, Mechanic> = new Map();
  displayedColumns: string[] = ['vehicle', 'status', 'startDate', 'endDate', 'mechanics', 'actions'];
  isAdmin = false;

  constructor(
    private workOrderService: WorkOrderService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadWorkOrders();
    this.loadVehicles();
    this.loadMechanics();
    this.isAdmin = this.authService.getCurrentUserRole()?.toUpperCase() === 'ADMIN';
  }

  loadWorkOrders() {
    this.workOrderService.getAll().subscribe(workOrders => {
      this.workOrders = workOrders;
    });
  }

  loadVehicles() {
    this.vehicleService.getAllVehicles().subscribe((vehicles: Vehicle[]) => {
      vehicles.forEach(vehicle => {
        this.vehicles.set(vehicle.id, vehicle);
      });
    });
  }

  loadMechanics() {
    this.mechanicService.getAll().subscribe((mechanics: Mechanic[]) => {
      mechanics.forEach(mechanic => {
        this.mechanics.set(mechanic.id, mechanic);
      });
    });
  }

  getVehicleInfo(vehicleId: number): string {
    const vehicle = this.vehicles.get(vehicleId);
    return vehicle ? `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}` : 'Unknown';
  }

  getMechanicInfo(mechanicId: number): string {
    const mechanic = this.mechanics.get(mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Unknown';
  }

  deleteWorkOrder(workOrder: WorkOrder): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Work Order',
        message: 'Are you sure you want to delete this work order?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.delete(workOrder.id!).subscribe(() => {
          this.loadWorkOrders();
        });
      }
    });
  }
} 
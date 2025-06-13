import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrderService, WorkOrder, WorkOrderStatus } from '../../../services/work-order.service';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { MechanicService, Mechanic } from '../../../services/mechanic.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './work-order-form.component.html',
  styleUrls: ['./work-order-form.component.scss']
})
export class WorkOrderFormComponent implements OnInit {
  workOrderForm!: FormGroup;
  workOrderId: number | null = null;
  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];
  workOrderStatus = Object.values(WorkOrderStatus);

  constructor(
    private fb: FormBuilder,
    private workOrderService: WorkOrderService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVehicles();
    this.loadMechanics();

    this.workOrderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.workOrderId) {
      this.workOrderService.getById(this.workOrderId).subscribe(workOrder => {
        this.workOrderForm.patchValue({
          ...workOrder,
          vehicleId: workOrder.vehicleId,
          mechanicIds: workOrder.mechanicIds || []
        });
      });
    }
  }

  initForm(): void {
    this.workOrderForm = this.fb.group({
      id: [null],
      vehicleId: [null, Validators.required],
      description: ['', Validators.required],
      status: [WorkOrderStatus.PENDING, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null],
      mechanicIds: [[]]
    });
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  loadMechanics(): void {
    this.mechanicService.getAll().subscribe((mechanics: Mechanic[]) => {
      this.mechanics = mechanics;
    });
  }

  onSubmit(): void {
    if (this.workOrderForm.valid) {
      const workOrder: WorkOrder = this.workOrderForm.value;

      if (this.workOrderId) {
        this.workOrderService.update(this.workOrderId, workOrder).subscribe(() => {
          this.snackBar.open('Work Order updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/work-orders']);
        });
      } else {
        this.workOrderService.create(workOrder).subscribe(() => {
          this.snackBar.open('Work Order created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/work-orders']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/work-orders']);
  }
} 
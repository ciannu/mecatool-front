import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VehiclesService } from '../vehicles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../../models/vehicle.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vehicle-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './vehicle-edit.component.html',
  styleUrl: './vehicle-edit.component.scss',
})
export class VehicleEditComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleId: number = 0;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehiclesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(this.currentYear),
        ],
      ],
      licensePlate: [
        '',
        [Validators.required, Validators.pattern('^[A-Z0-9-]+$')],
      ],
      color: ['', Validators.required],
      clientId: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.vehicleId) {
      this.loadVehicle();
    }
  }

  loadVehicle(): void {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicleForm.patchValue({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          licensePlate: vehicle.licensePlate,
          color: vehicle.color,
          clientId: vehicle.client.id
        });
      },
      error: (err) => {
        console.error('Error loading vehicle:', err);
        this.router.navigate(['/vehicles']);
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    const updatedVehicle: Vehicle = {
      ...this.vehicleForm.value,
      id: this.vehicleId,
      client: { id: this.vehicleForm.value.clientId },
    };

    console.log(updatedVehicle);

    this.vehicleService.updateVehicle(updatedVehicle).subscribe({
      next: (updatedVehicle) => {
        this.snackBar.open('Vehículo actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/vehicles']);
      },
      error: (err) => console.error('Error updating vehicle:', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}

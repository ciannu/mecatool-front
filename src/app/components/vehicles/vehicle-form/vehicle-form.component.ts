import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { VehiclesService } from '../vehicles.service';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { Observable, startWith, map } from 'rxjs';

function isClient(value: any): value is Client {
  return typeof value === 'object' && value !== null && 'id' in value && 'firstName' in value && 'lastName' in value;
}

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
  ],
  providers: [ClientService],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss',
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  currentYear = new Date().getFullYear();
  clients: Client[] = [];
  filteredClients: Observable<Client[]> = new Observable<Client[]>();
  clientControl = new FormControl<string | Client | null>(null, [Validators.required, this.clientValidator()]);

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehiclesService,
    private router: Router,
    private clientService: ClientService
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      licensePlate: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z0-9-]+$'),
        ],
      ],
      color: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.clientService.getAll().subscribe((clients: Client[]) => {
      this.clients = clients;
    });

    this.filteredClients = this.clientControl.valueChanges.pipe(
      startWith(this.clientControl.value),
      map((value) => this._filterClients(value))
    );
  }

  private _filterClients(value: string | Client | null): Client[] {
    if (value === null) {
      return this.clients;
    }
    const filterValue = typeof value === 'string' ? value.toLowerCase() : this.displayClientName(value).toLowerCase();
    return this.clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(filterValue) ||
        client.lastName.toLowerCase().includes(filterValue)
    );
  }

  displayClientName(client: Client | null): string {
    return client ? `${client.firstName} ${client.lastName}` : '';
  }

  private clientValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedClientValue = control.value;

      if (!selectedClientValue) {
        return { 'required': true };
      }

      if (isClient(selectedClientValue)) {
        const found = this.clients.some(c => c.id === selectedClientValue.id);
        return found ? null : { 'incorrect': true };
      }

      if (typeof selectedClientValue === 'string') {
        const found = this.clients.some(client =>
          this.displayClientName(client).toLowerCase() === selectedClientValue.toLowerCase()
        );
        return found ? null : { 'incorrect': true };
      }

      return { 'incorrect': true };
    };
  }

  onSubmit(): void {
    this.clientControl.updateValueAndValidity();
    if (this.vehicleForm.invalid || this.clientControl.invalid) {
      return;
    }

    let clientId: number | null = null;
    const selectedClientValue = this.clientControl.value;

    if (isClient(selectedClientValue)) {
      clientId = selectedClientValue.id;
    } else if (typeof selectedClientValue === 'string') {
      const foundClient = this.clients.find(client =>
        this.displayClientName(client).toLowerCase() === selectedClientValue.toLowerCase()
      );
      clientId = foundClient ? foundClient.id : null;
    }

    if (!clientId) {
      console.error('Client not selected or invalid');
      this.clientControl.setErrors({ 'incorrect': true });
      return;
    }

    const formValue = this.vehicleForm.value;

    const newVehicle = {
      brand: formValue.brand,
      model: formValue.model,
      year: formValue.year,
      licensePlate: formValue.licensePlate,
      color: formValue.color,
      client: {
        id: clientId,
      },
    };

    this.vehicleService.createVehicle(newVehicle).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: (err) => console.error('Error creating vehicle: ', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}


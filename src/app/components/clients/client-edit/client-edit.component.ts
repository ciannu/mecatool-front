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
import { ClientService } from '../../../services/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss',
})
export class ClientEditComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number = 0;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clientId) {
      this.loadClient();
    }
  }

  loadClient(): void {
    this.clientService.getById(this.clientId).subscribe({
      next: (client: Client) => {
        this.clientForm.patchValue({
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          email: client.email,
          address: client.address,
        });
      },
      error: (err: any) => {
        console.error('Error loading client:', err);
        this.router.navigate(['/clients']);
      },
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const updatedClient: Client = {
      ...this.clientForm.value,
      id: this.clientId,
    };

    this.clientService.update(this.clientId, updatedClient).subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err: any) => console.error('Error updating client:', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}

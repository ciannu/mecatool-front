import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientsService } from '../clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientsService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.clientService.createClient(this.clientForm.value).subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => console.error('Error creating client: ', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}

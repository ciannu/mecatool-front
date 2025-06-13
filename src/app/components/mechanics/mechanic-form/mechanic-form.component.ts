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
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../../services/mechanic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mechanic } from '../../../models/mechanic.model';

@Component({
  selector: 'app-mechanic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './mechanic-form.component.html',
  styleUrl: './mechanic-form.component.scss',
})
export class MechanicFormComponent implements OnInit {
  mechanicForm: FormGroup;
  mechanicId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private mechanicService: MechanicService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.mechanicForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mechanicId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.mechanicId) {
      this.isEditMode = true;
      this.loadMechanic();
    }
  }

  loadMechanic(): void {
    if (this.mechanicId) {
      this.mechanicService.getById(this.mechanicId).subscribe({
        next: (mechanic: Mechanic) => {
          this.mechanicForm.patchValue(mechanic);
        },
        error: (err) => {
          console.error('Error loading mechanic:', err);
          this.snackBar.open('Error loading mechanic', 'Close', { duration: 3000 });
          this.router.navigate(['/mechanics']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mechanicForm.invalid) {
      return;
    }

    const mechanic: Mechanic = this.mechanicForm.value;

    if (this.isEditMode && this.mechanicId) {
      this.mechanicService.update(this.mechanicId, mechanic).subscribe({
        next: () => {
          this.snackBar.open('Mechanic updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/mechanics']);
        },
        error: (err) => {
          console.error('Error updating mechanic:', err);
          this.snackBar.open('Error updating mechanic', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.mechanicService.create(mechanic).subscribe({
        next: () => {
          this.snackBar.open('Mechanic added successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/mechanics']);
        },
        error: (err) => {
          console.error('Error adding mechanic:', err);
          this.snackBar.open('Error adding mechanic', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/mechanics']);
  }
} 
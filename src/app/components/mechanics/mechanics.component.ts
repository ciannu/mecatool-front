import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../services/mechanic.service';
import { Mechanic } from '../../models/mechanic.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mechanics',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './mechanics.component.html',
  styleUrl: './mechanics.component.scss'
})
export class MechanicsComponent implements OnInit {
  mechanics: Mechanic[] = [];
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
  loading = true;
  error: string | null = null;
  searchControl = new FormControl('');
  isAdmin = false;

  constructor(
    private mechanicService: MechanicService,
    private snackBar: MatSnackBar,
    private router: RouterModule,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMechanics();
    this.setupSearch();
    this.isAdmin = this.authService.getCurrentUserRole()?.toUpperCase() === 'ADMIN';

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.loadMechanics(query || '');
      });
  }

  loadMechanics(query: string = ''): void {
    this.loading = true;
    this.error = null;
    this.mechanicService.getAll().subscribe({
      next: (mechanics: Mechanic[]) => {
        this.mechanics = query
          ? mechanics.filter(mechanic =>
            mechanic.firstName.toLowerCase().includes(query.toLowerCase()) ||
            mechanic.lastName.toLowerCase().includes(query.toLowerCase()) ||
            mechanic.email.toLowerCase().includes(query.toLowerCase())
          )
          : mechanics;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading mechanics:', err);
        this.error = 'Error loading mechanics';
        this.loading = false;
      }
    });
  }

  deleteMechanic(id: number): void {
    if (confirm('Are you sure you want to delete this mechanic?')) {
      this.mechanicService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Mechanic deleted successfully!', 'Close', { duration: 3000 });
          this.loadMechanics(this.searchControl.value || '');
        },
        error: (err: any) => {
          console.error('Error deleting mechanic:', err);
          this.snackBar.open('Error deleting mechanic', 'Close', { duration: 3000 });
        }
      });
    }
  }

  setupSearch(): void {
  }
} 
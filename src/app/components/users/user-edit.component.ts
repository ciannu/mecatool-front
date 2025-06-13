import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  userId: number;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = 0; // Initialize with a default value
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)], // Password is optional for edit
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserData(this.userId);
      } else {
        this.snackBar.open('User ID not provided for editing.', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.snackBar.open('Error loading roles. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId
        });
      },
      error: (err) => {
        console.error('Error loading user data:', err);
        this.snackBar.open('Failed to load user data.', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const updatedUser: User = {
      id: this.userId,
      ...this.userForm.value
    };

    // Remove password if it's not provided or empty for update
    if (!updatedUser.password) {
      delete updatedUser.password;
    }

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (user) => {
        this.snackBar.open(`User ${user.firstName} updated successfully!`, 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        let errorMessage = 'Failed to update user. Please try again.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }
} 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';

import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { UserRegister } from '../../models/user-register.model';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
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

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const newUser: UserRegister = this.userForm.value;
    this.userService.createUser(newUser).subscribe({
      next: (user) => {
        this.snackBar.open(`User ${user.firstName} created successfully!`, 'Close', { duration: 3000 });
        this.userForm.reset();
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        let errorMessage = 'Failed to create user. Please try again.';
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
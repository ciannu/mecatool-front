import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileUpdate } from '../../models/user-profile-update.model';
import { UserPasswordUpdate } from '../../models/user-password-update.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  accountForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.accountForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  updateAccount() {
    if (this.accountForm.valid && this.currentUser) {
      const profileData: UserProfileUpdate = this.accountForm.value;
      this.authService.updateProfile(this.currentUser.id, profileData).subscribe({
        next: (response) => {
          this.snackBar.open('Account updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open(`Error updating account: ${error.message || error.error?.message}`, 'Close', {
            duration: 5000,
          });
          console.error('Error updating account:', error);
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid && this.currentUser) {
      const passwordData: UserPasswordUpdate = {
        currentPassword: this.passwordForm.get('currentPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value,
      };

      this.authService.changePassword(this.currentUser.id, passwordData).subscribe({
        next: () => {
          this.snackBar.open('Password updated successfully!', 'Close', {
            duration: 3000,
          });
          this.passwordForm.reset();
        },
        error: (error) => {
          this.snackBar.open(`Error updating password: ${error.message || error.error?.message}`, 'Close', {
            duration: 5000,
          });
          console.error('Error updating password:', error);
        }
      });
    }
  }
} 
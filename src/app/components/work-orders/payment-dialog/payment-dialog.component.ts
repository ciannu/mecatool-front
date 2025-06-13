import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Payment } from '../../../services/invoice.service';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Add Payment</h2>
    <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount" required>
          <mat-error *ngIf="paymentForm.get('amount')?.hasError('required')">
            Amount is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Payment Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="paymentDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="paymentForm.get('paymentDate')?.hasError('required')">
            Payment date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Payment Method</mat-label>
          <mat-select formControlName="method" required>
            <mat-option value="CASH">Cash</mat-option>
            <mat-option value="CREDIT_CARD">Credit Card</mat-option>
            <mat-option value="DEBIT_CARD">Debit Card</mat-option>
            <mat-option value="BANK_TRANSFER">Bank Transfer</mat-option>
          </mat-select>
          <mat-error *ngIf="paymentForm.get('method')?.hasError('required')">
            Payment method is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Note</mat-label>
          <textarea matInput formControlName="note"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="paymentForm.invalid">
          Add Payment
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
  `]
})
export class PaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoiceId: number }
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentDate: [new Date(), Validators.required],
      method: ['', Validators.required],
      note: ['']
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const payment: Payment = {
        ...this.paymentForm.value,
        invoiceId: this.data.invoiceId
      };
      this.dialogRef.close(payment);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 
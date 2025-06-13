import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from '../../../services/inventory.service';
import { InventoryItem, WorkOrderItem } from '../../../models/work-order-item.model';
import { WorkOrderService } from '../../../services/work-order.service';

@Component({
  selector: 'app-work-order-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEditMode ? 'Edit' : 'Add'}} Item</h2>
    <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Item</mat-label>
          <mat-select formControlName="inventoryItemId" required [disabled]="isEditMode" (selectionChange)="onItemSelected($event)">
            <mat-option *ngFor="let item of inventoryItems" [value]="item.id">
              {{item.name}} - {{item.price | currency}} (Stock: {{item.quantity}})
            </mat-option>
          </mat-select>
          <mat-error *ngIf="itemForm.get('inventoryItemId')?.hasError('required')">
            Item is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" required min="1" [max]="selectedItem?.quantity || 1">
          <mat-error *ngIf="itemForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="itemForm.get('quantity')?.hasError('min')">
            Quantity must be at least 1
          </mat-error>
          <mat-error *ngIf="itemForm.get('quantity')?.hasError('max')">
            Quantity cannot exceed available stock ({{selectedItem?.quantity || 0}})
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" required min="0">
          <mat-error *ngIf="itemForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="itemForm.get('price')?.hasError('min')">
            Price must be positive
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="itemForm.invalid || isSubmitting">
          {{isEditMode ? 'Update' : 'Add'}}
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
export class WorkOrderItemDialogComponent implements OnInit {
  itemForm: FormGroup;
  inventoryItems: InventoryItem[] = [];
  isEditMode = false;
  selectedItem?: InventoryItem;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WorkOrderItemDialogComponent>,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    private workOrderService: WorkOrderService,
    @Inject(MAT_DIALOG_DATA) public data: { workOrderId: number; item?: WorkOrderItem }
  ) {
    this.isEditMode = !!data.item;
    this.itemForm = this.fb.group({
      id: [data.item?.id || null],
      inventoryItemId: [data.item?.inventoryItem?.id || '', Validators.required],
      quantity: [data.item?.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [data.item?.price || 0, [Validators.required, Validators.min(0)]]
    });

    // Add max validator for quantity
    this.itemForm.get('quantity')?.setValidators([
      Validators.required,
      Validators.min(1),
      (control) => {
        const max = this.selectedItem?.quantity ?? 0;
        return control.value > max ? { max: true } : null;
      }
    ]);
  }

  ngOnInit() {
    this.loadInventoryItems();
  }

  loadInventoryItems() {
    this.inventoryService.getAll().subscribe(items => {
      this.inventoryItems = items;
      if (!this.isEditMode && items.length > 0) {
        const firstItem = items[0];
        this.selectedItem = firstItem;
        this.itemForm.patchValue({
          inventoryItemId: firstItem.id,
          price: firstItem.price
        });
      } else if (this.isEditMode && this.data.item?.inventoryItem) {
        this.selectedItem = this.data.item.inventoryItem;
      }
    });
  }

  onItemSelected(event: any) {
    const selectedItem = this.inventoryItems.find(item => item.id === event.value);
    if (selectedItem) {
      this.selectedItem = selectedItem;
      this.itemForm.patchValue({
        price: selectedItem.price
      });
      // Update quantity validator
      this.itemForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        (control) => {
          const max = selectedItem.quantity ?? 0;
          return control.value > max ? { max: true } : null;
        }
      ]);
      this.itemForm.get('quantity')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.isSubmitting = true;
      const formValue = this.itemForm.value;
      const selectedInventoryItem = this.inventoryItems.find(i => i.id === formValue.inventoryItemId);
      
      if (!selectedInventoryItem) {
        this.snackBar.open('Please select a valid inventory item', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        return;
      }

      const item: WorkOrderItem = {
        inventoryItem: selectedInventoryItem,
        quantity: formValue.quantity,
        price: formValue.price,
        workOrderId: this.data.workOrderId
      };

      if (this.isEditMode && formValue.id) {
        this.inventoryService.updateWorkOrderItem(this.data.workOrderId, formValue.id, item).subscribe({
          next: () => {
            this.snackBar.open('Work order item updated successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(item);
            this.isSubmitting = false;
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to update work order item', 'Close', { duration: 5000 });
            this.isSubmitting = false;
          }
        });
      } else {
        this.inventoryService.addWorkOrderItem(this.data.workOrderId, item).subscribe({
          next: () => {
            this.snackBar.open('Work order item added successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(item);
            this.isSubmitting = false;
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to add work order item', 'Close', { duration: 5000 });
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 
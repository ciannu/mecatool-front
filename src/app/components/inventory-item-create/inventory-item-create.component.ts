import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/work-order-item.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory-item-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './inventory-item-create.component.html',
  styleUrls: ['./inventory-item-create.component.scss']
})
export class InventoryItemCreateComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  categories = [
    'Parts',
    'Tools',
    'Supplies',
    'Equipment',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // No specific initialization needed for creation mode
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const item: InventoryItem = { ...this.form.value };
      delete item.id;
      this.inventoryService.create(item).subscribe({
        next: () => {
          this.snackBar.open('Item created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/inventory-items']);
        },
        error: (error) => {
          this.snackBar.open('Error creating item', 'Close', { duration: 3000 });
          console.error('Error creating item:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventory-items']);
  }
} 
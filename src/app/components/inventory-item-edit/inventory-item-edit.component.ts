import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/work-order-item.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory-item-edit',
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
  templateUrl: './inventory-item-edit.component.html',
  styleUrls: ['./inventory-item-edit.component.scss']
})
export class InventoryItemEditComponent implements OnInit {
  form!: FormGroup;
  itemId: number | null = null;
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itemId = +id;
      this.loadItem(this.itemId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  loadItem(id: number): void {
    this.isLoading = true;
    this.inventoryService.getById(id).subscribe({
      next: (item) => {
        this.form.patchValue(item);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading inventory item', 'Close', { duration: 3000 });
        console.error('Error loading inventory item:', error);
        this.isLoading = false;
        this.router.navigate(['/inventory-items']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.itemId) {
      this.isLoading = true;
      const item: InventoryItem = this.form.value;
      item.id = this.itemId;
      this.inventoryService.update(this.itemId, item).subscribe({
        next: () => {
          this.snackBar.open('Item updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/inventory-items']);
        },
        error: (error) => {
          this.snackBar.open('Error updating item', 'Close', { duration: 3000 });
          console.error('Error updating item:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventory-items']);
  }
} 
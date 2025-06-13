import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/work-order-item.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-inventory-items',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './inventory-items.component.html',
  styleUrls: ['./inventory-items.component.scss']
})
export class InventoryItemsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'quantity', 'minStock', 'price', 'actions'];
  dataSource: InventoryItem[] = [];
  categories: string[] = [
    'Parts',
    'Tools',
    'Supplies',
    'Equipment',
    'Other'
  ];
  categoryFilter = new FormControl('');
  lowStockFilter = new FormControl(false);

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadInventoryItems();
  }

  loadInventoryItems(): void {
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.dataSource = items;
        this.applyFilters(); // Apply filters initially after loading all items
      },
      error: (error) => {
        this.snackBar.open('Error loading inventory items', 'Close', { duration: 3000 });
        console.error('Error loading inventory items:', error);
      }
    });
  }

  applyFilters(): void {
    let filteredItems = this.dataSource;

    const selectedCategory = this.categoryFilter.value;
    if (selectedCategory) {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }

    const showLowStock = this.lowStockFilter.value;
    if (showLowStock) {
      filteredItems = filteredItems.filter(item => item.quantity <= item.minStock);
    }

    this.dataSource = filteredItems;
  }

  editItem(id: number): void {
    this.router.navigate(['/inventory-items/edit', id]);
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Inventory item deleted successfully!', 'Close', { duration: 3000 });
          this.loadInventoryItems();
        },
        error: (error) => {
          this.snackBar.open('Error deleting inventory item', 'Close', { duration: 3000 });
          console.error('Error deleting inventory item:', error);
        }
      });
    }
  }

  createItem(): void {
    this.router.navigate(['/inventory-items/new']);
  }
} 
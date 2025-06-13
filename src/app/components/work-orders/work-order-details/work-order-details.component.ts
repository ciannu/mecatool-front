import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkOrderService, WorkOrder, WorkOrderStatus } from '../../../services/work-order.service';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { MechanicService, Mechanic } from '../../../services/mechanic.service';
import { InventoryService } from '../../../services/inventory.service';
import { InventoryItem, WorkOrderItem } from '../../../models/work-order-item.model';
import { InvoiceService, Invoice, Payment, InvoiceStatus } from '../../../services/invoice.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { WorkOrderItemDialogComponent } from '../work-order-item-dialog/work-order-item-dialog.component';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-work-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './work-order-details.component.html',
  styleUrls: ['./work-order-details.component.scss']
})
export class WorkOrderDetailsComponent implements OnInit {
  workOrder?: WorkOrder;
  vehicle?: Vehicle;
  mechanics: Mechanic[] = [];
  inventoryItems: InventoryItem[] = [];
  workOrderItems: WorkOrderItem[] = [];
  invoice?: Invoice;
  payments: Payment[] = [];
  displayedColumns = ['name', 'quantity', 'price', 'total', 'actions'];
  paymentColumns = ['date', 'amount', 'method', 'note'];
  WorkOrderStatus = WorkOrderStatus;
  InvoiceStatus = InvoiceStatus;
  isMechanicOrAdmin = false;

  constructor(
    private workOrderService: WorkOrderService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private inventoryService: InventoryService,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadData();
  }

  checkUserRole(): void {
    const userRole = this.authService.getCurrentUserRole()?.toUpperCase();
    this.isMechanicOrAdmin = userRole === 'ADMIN' || userRole === 'MECHANIC';
  }

  loadData() {
    const workOrderId = Number(this.route.snapshot.paramMap.get('id'));
    if (workOrderId) {
      this.workOrderService.getById(workOrderId).subscribe(workOrder => {
        this.workOrder = workOrder;
        this.loadVehicle();
        this.loadMechanics();
        this.loadWorkOrderItems();
        this.loadInvoice();
      });
    }
  }

  loadVehicle() {
    if (this.workOrder?.vehicleId) {
      this.vehicleService.getVehicleById(this.workOrder.vehicleId).subscribe(vehicle => {
        this.vehicle = vehicle;
      });
    }
  }

  loadMechanics() {
    if (this.workOrder?.mechanicIds && this.workOrder.mechanicIds.length > 0) {
      this.mechanicService.getMechanicsByIds(this.workOrder.mechanicIds).subscribe(mechanics => {
        this.mechanics = mechanics;
      });
    } else {
      this.mechanics = [];
    }
  }

  loadWorkOrderItems() {
    if (this.workOrder?.id) {
      this.inventoryService.getWorkOrderItems(this.workOrder.id).subscribe(items => {
        this.workOrderItems = items;
      });
    }
  }

  loadInvoice() {
    if (this.workOrder?.id) {
      this.invoiceService.getByWorkOrder(this.workOrder.id).subscribe(invoices => {
        if (invoices && invoices.length > 0) {
          this.invoice = invoices[0];
          this.payments = this.invoice.payments || [];
        }
      });
    }
  }

  calculateTotal(): number {
    return this.workOrderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculatePaidAmount(): number {
    return this.payments.reduce((total, payment) => total + payment.amount, 0);
  }

  calculateRemainingAmount(): number {
    return this.calculateTotal() - this.calculatePaidAmount();
  }

  openAddItemDialog() {
    const workOrderId = this.workOrder?.id;
    if (!workOrderId) return;

    const dialogRef = this.dialog.open(WorkOrderItemDialogComponent, {
      data: { workOrderId }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.loadWorkOrderItems();
        this.snackBar.open('Item añadido correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openEditItemDialog(item: WorkOrderItem) {
    const workOrderId = this.workOrder?.id;
    const itemId = item.id;
    if (!workOrderId || !itemId) return;

    const dialogRef = this.dialog.open(WorkOrderItemDialogComponent, {
      data: { workOrderId, item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWorkOrderItems();
        this.snackBar.open('Item actualizado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteItem(item: WorkOrderItem) {
    const workOrderId = item.workOrderId;
    const itemId = item.id;
    if (!workOrderId || !itemId) return;

    if (confirm('¿Está seguro de que desea eliminar este ítem?')) {
      this.inventoryService.deleteWorkOrderItem(workOrderId, itemId).subscribe({
        next: () => {
          this.loadWorkOrderItems();
          this.snackBar.open('Item eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar el item', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  openAddPaymentDialog() {
    const invoiceId = this.invoice?.id;
    if (!invoiceId) return;

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: { invoiceId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invoiceService.addPayment(invoiceId, result).subscribe(() => {
          this.loadInvoice();
        });
      }
    });
  }

  generateInvoice() {
    const workOrderId = this.workOrder?.id;
    if (!workOrderId) return;

    this.invoiceService.createFromWorkOrder(workOrderId).subscribe(invoice => {
      this.invoice = invoice;
      this.payments = invoice.payments || [];
    });
  }

  generatePdf() {
    if (this.invoice?.id) {
      this.invoiceService.generatePdf(this.invoice.id).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${this.invoice?.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          this.snackBar.open('Factura PDF generada correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error al generar el PDF de la factura', error);
          this.snackBar.open('Error al generar el PDF de la factura', 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('No hay factura para generar PDF', 'Cerrar', { duration: 3000 });
    }
  }
} 
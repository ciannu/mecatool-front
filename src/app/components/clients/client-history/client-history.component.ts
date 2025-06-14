import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrderService } from '../../../services/work-order.service';
import { WorkOrderDTO } from '../../../models/work-order.model';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.scss']
})
export class ClientHistoryComponent implements OnInit {
  clientId: number | null = null;
  workOrders: WorkOrderDTO[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'totalPrice', 'date', 'vehicleLicensePlate'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workOrderService: WorkOrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.clientId = +id;
        this.loadWorkOrdersHistory(this.clientId);
      }
    });
  }

  loadWorkOrdersHistory(clientId: number): void {
    this.workOrderService.getWorkOrdersByClientId(clientId).subscribe({
      next: (workOrders: WorkOrderDTO[]) => {
        this.workOrders = workOrders;
      },
      error: (err) => {
        console.error('Error loading work order history:', err);
      }
    });
  }

  onBack(): void {
    if (this.clientId) {
      this.router.navigate(['/clients', this.clientId]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
} 
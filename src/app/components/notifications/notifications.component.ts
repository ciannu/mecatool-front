import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  allNotifications: Notification[] = [];
  selectedTabIndex: number = 0; // Only one tab now

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllNotifications();
  }

  loadAllNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(notifications => {
      this.allNotifications = notifications;
    });
  }

  deleteNotification(notificationId: number | undefined): void {
    if (notificationId) {
      this.notificationService.deleteNotification(notificationId).subscribe(() => {
        this.snackBar.open('Notification deleted', 'Close', { duration: 2000 });
        this.loadAllNotifications(); // Refresh the list
      }, error => {
        console.error('Error deleting notification:', error);
        this.snackBar.open('Failed to delete notification', 'Close', { duration: 3000 });
      });
    }
  }

  onTabChange(event: any): void {
    // No longer needed as there's only one tab
  }
} 
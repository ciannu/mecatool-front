import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
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
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  allNotifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  selectedTabIndex: number = 0; // 0 for All, 1 for Unread

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllNotifications();
    this.loadUnreadNotifications();
  }

  loadAllNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(notifications => {
      this.allNotifications = notifications;
    });
  }

  loadUnreadNotifications(): void {
    this.notificationService.getUnreadNotifications().subscribe(notifications => {
      this.unreadNotifications = notifications;
      console.log('Unread Notifications loaded. Checking isRead status:');
      notifications.forEach(notif => console.log(`Notification ID: ${notif.id}, isRead: ${notif.isRead}`));
    });
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead && notification.id) {
      notification.isRead = true;

      this.notificationService.markAsRead(notification.id).subscribe(() => {
        this.snackBar.open('Notification marked as read', 'Close', { duration: 2000 });
        this.loadAllNotifications();
        this.loadUnreadNotifications();
      }, error => {
        console.error('Error marking as read:', error);
        this.snackBar.open('Failed to mark as read', 'Close', { duration: 3000 });
        notification.isRead = false;
      });
    }
  }

  deleteNotification(notificationId: number | undefined): void {
    if (notificationId) {
      this.notificationService.deleteNotification(notificationId).subscribe(() => {
        this.snackBar.open('Notification deleted', 'Close', { duration: 2000 });
        this.loadAllNotifications(); // Refresh both lists
        this.loadUnreadNotifications();
      }, error => {
        console.error('Error deleting notification:', error);
        this.snackBar.open('Failed to delete notification', 'Close', { duration: 3000 });
      });
    }
  }

  getDisplayedNotifications(): Notification[] {
    return this.selectedTabIndex === 0 ? this.allNotifications : this.unreadNotifications;
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
} 
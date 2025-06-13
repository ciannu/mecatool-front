import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  isAdmin = false;
  currentUser: any;
  
  menuItems = [
    {
      icon: 'home',
      label: 'Home',
      route: '/'
    },
    {
      icon: 'people',
      label: 'Clients',
      route: '/clients'
    },
    {
      icon: 'directions_car',
      label: 'Vehicles',
      route: '/vehicles'
    },
    {
      icon: 'engineering',
      label: 'Mechanics',
      route: '/mechanics'
    },
    {
      icon: 'build',
      label: 'Work Orders',
      route: '/work-orders'
    },
    {
      icon: 'inventory_2',
      label: 'Inventory Items',
      route: '/inventory-items'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/settings'
    }
  ];

  adminMenuItems = [
    {
      icon: 'group',
      label: 'Manage Users',
      route: '/users'
    }
  ];

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.roleName?.toUpperCase() === 'ADMIN';
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  onLogout(): void {
    this.authService.logout();
  }
} 
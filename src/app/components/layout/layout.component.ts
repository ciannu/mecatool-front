import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThemeService } from '../../services/theme.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatIcon, SidebarComponent, AsyncPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarCollapsed = false;
  constructor(public themeService: ThemeService) {}

  onSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  menuItems = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Clients', icon: 'people', route: '/clients' },
    { label: 'Projects', icon: 'work', route: '/projects' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}

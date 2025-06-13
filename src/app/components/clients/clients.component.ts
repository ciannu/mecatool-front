import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})

export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error: string | null = null;
  searchControl = new FormControl('');
  isAdmin = false;

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadClients();
    this.setupSearch();
    this.isAdmin = this.authService.getCurrentUserRole()?.toUpperCase() === 'ADMIN';
  }

  loadClients(query: string = '') {
    this.loading = true;
    this.error = null;
    if (query) {
      this.clientService.searchClients(query).subscribe({
        next: (clients: Client[]) => {
          this.clients = clients;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to load clients.';
          this.loading = false;
          console.error('Error loading clients:', err);
        },
      });
    } else {
      this.clientService.getAll().subscribe({
        next: (clients: Client[]) => {
          this.clients = clients;
          this.loading = false;
        },
        error: (err: any) => {
          (this.error = 'Failed to load clients.'), err;
          this.loading = false;
        },
      });
    }
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.loadClients(this.searchControl.value || ''); // Reload with current search query
        },
        error: (err: any) => {
          console.error('Error deleting client:', err);
          this.error = 'Failed to delete client.';
        }
      });
    }
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.loadClients(query || '');
    });
  }
}

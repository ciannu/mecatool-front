import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserLogin } from '../models/user-login.model';
import { UserRegister } from '../models/user-register.model';
import { AuthResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      const parsedUser: User = JSON.parse(user);
      this.userSubject.next(parsedUser);
    }
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        
        const frontendUser: User = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          roleId: response.user.roleId,
          roleName: response.user.role ? response.user.role.name : undefined,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        localStorage.setItem('user', JSON.stringify(frontendUser));
        this.userSubject.next(frontendUser);
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  register(userData: UserRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        
        const frontendUser: User = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          roleId: response.user.roleId,
          roleName: response.user.role ? response.user.role.name : undefined,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        localStorage.setItem('user', JSON.stringify(frontendUser));
        this.userSubject.next(frontendUser);
        this.router.navigate(['/home']);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUserRole(): string | undefined {
    const user = this.userSubject.value;
    return user?.roleName;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

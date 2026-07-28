import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap, catchError, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrentUser } from '../models/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  login(username: string, password: string): Observable<CurrentUser> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post(
      `${this.apiUrl}/login`,
      body.toString(),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        withCredentials: true,
        responseType: 'text'
      }
    ).pipe(
      // Switch map automatically chains the user profile fetch after a successful login
      switchMap(() => this.getCurrentUser())
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(
      `${this.apiUrl}/api/me`,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  isHr(): boolean {
    return this.currentUser?.role === 'HR';
  }

  isEmployee(): boolean {
    return this.currentUser?.role === 'EMPLOYEE';
  }
}

// Global initializer function to fetch the active session before the app loads
export function initializeApp(authService: AuthService) {
  return () => authService.getCurrentUser().pipe(
    catchError(() => of(null)) // Ignores errors (e.g. 401 Unauthorized) so guests can still access public routes
  );
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/users`;

  // --- ADDED THIS METHOD ---
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, {
      withCredentials: true
    });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      withCredentials: true
    });
  }

  // Your update method expects (id, user)
  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
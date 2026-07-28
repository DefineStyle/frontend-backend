import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Position } from '../models/position';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/positions`;

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  create(position: Position): Observable<Position> {
    return this.http.post<Position>(this.apiUrl, position, {
      withCredentials: true
    });
  }

  update(id: number, position: Position): Observable<Position> {
    return this.http.put<Position>(`${this.apiUrl}/${id}`, position, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

}
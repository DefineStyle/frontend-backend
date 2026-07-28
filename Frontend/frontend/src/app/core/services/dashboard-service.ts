import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models/dashboard-model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard/stats`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl, { 
      withCredentials: true 
    });
  }

  getRecentHires(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/api/dashboard/recent-hires?page=${page}&size=${size}`, 
      { withCredentials: true }
    );
  }
}
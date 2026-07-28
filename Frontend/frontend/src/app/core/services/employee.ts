import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/employee';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/employees`;

  getAll(): Observable<Employee[]> {

    return this.http.get<Employee[]>(
      this.apiUrl,
      {
        withCredentials: true
      }
    );

  }

  getById(id: number): Observable<Employee> {

    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );

  }

  create(employee: Employee): Observable<Employee> {

    return this.http.post<Employee>(
      this.apiUrl,
      employee,
      {
        withCredentials: true
      }
    );

  }

  update(id: number, employee: Employee): Observable<Employee> {

    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee,
      {
        withCredentials: true
      }
    );

  }

  delete(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );

  }

  getDepartments(): Observable<any[]> {

    return this.http.get<any[]>(
      `${environment.apiUrl}/api/departments`,
      {
        withCredentials: true
      }
    );

  }

  getPositions(): Observable<any[]> {

    return this.http.get<any[]>(
      `${environment.apiUrl}/api/positions`,
      {
        withCredentials: true
      }
    );

  }

  getGrades(): Observable<any[]> {

    return this.http.get<any[]>(
      `${environment.apiUrl}/api/grades`,
      {
        withCredentials: true
      }
    );

  }

}
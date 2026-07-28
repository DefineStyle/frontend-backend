import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from '../models/department';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/departments`;

  getAll(): Observable<Department[]> {

    return this.http.get<Department[]>(
      this.apiUrl,
      {
        withCredentials: true
      }
    );

  }

  create(department: Department): Observable<Department> {

    return this.http.post<Department>(
      this.apiUrl,
      department,
      {
        withCredentials: true
      }
    );

  }

  update(id: number, department: Department): Observable<Department> {

    return this.http.put<Department>(
      `${this.apiUrl}/${id}`,
      department,
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

}
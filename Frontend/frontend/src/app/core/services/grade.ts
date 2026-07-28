import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Grade } from '../models/grade';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/grades`;

  getAll(): Observable<Grade[]> {

    return this.http.get<Grade[]>(
      this.apiUrl,
      {
        withCredentials: true
      }
    );

  }

  create(grade: Grade): Observable<Grade> {

    return this.http.post<Grade>(
      this.apiUrl,
      grade,
      {
        withCredentials: true
      }
    );

  }

  update(id: number, grade: Grade): Observable<Grade> {

    return this.http.put<Grade>(
      `${this.apiUrl}/${id}`,
      grade,
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

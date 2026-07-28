import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Announcement } from '../models/announcement';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/announcements`;

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  create(announcement: Announcement): Observable<Announcement> {
    return this.http.post<Announcement>(
      this.apiUrl,
      announcement,
      {
        withCredentials: true
      }
    );
  }

  update(
    id: number,
    announcement: Announcement
  ): Observable<Announcement> {

    return this.http.put<Announcement>(
      `${this.apiUrl}/${id}`,
      announcement,
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
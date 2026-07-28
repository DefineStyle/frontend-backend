import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import {
  BehaviorSubject,
  of
} from 'rxjs';

import {
  switchMap,
  catchError,
  shareReplay,
  map
} from 'rxjs/operators';

import { Announcement } from '../../core/models/announcement';
import { AnnouncementService } from '../../core/services/announcement';

import { AuthService } from '../../core/services/auth';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {


  private announcementService = inject(AnnouncementService);

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);



  private refresh$ = new BehaviorSubject<void>(undefined);



  announcements$ = this.refresh$.pipe(

    switchMap(() =>
      this.announcementService.getAll().pipe(
        catchError(() => of([]))
      )
    ),


    map(list =>
      [...list].sort((a, b) =>
        new Date(b.createdAt ?? '').getTime() -
        new Date(a.createdAt ?? '').getTime()
      )
    ),


    shareReplay(1)

  );



  showModal = false;

  editing = false;

  editingId: number | null = null;

  announcementToDelete: Announcement | null = null;

  showDeleteModal = false;



  announcementForm = this.fb.group({

    title: [
      '',
      Validators.required
    ],


    message: [
      '',
      Validators.required
    ]

  });




  openAddModal(): void {

    this.editing = false;

    this.editingId = null;

    this.announcementForm.reset();

    this.showModal = true;

  }





  editAnnouncement(
    announcement: Announcement
  ): void {


    this.editing = true;

    this.editingId = announcement.id!;


    this.announcementForm.patchValue({

      title: announcement.title,

      message: announcement.message

    });


    this.showModal = true;

  }





  closeModal(): void {

    this.showModal = false;

  }





  saveAnnouncement(): void {


    if (this.announcementForm.invalid) {

      return;

    }



    const announcement: Announcement = {


      title: this.announcementForm.value.title!,


      message: this.announcementForm.value.message!


    };





    const request$ = this.editing


      ? this.announcementService.update(
          this.editingId!,
          announcement
        )


      : this.announcementService.create(
          announcement
        );






    request$.subscribe(() => {


      this.refresh$.next();


      this.closeModal();


    });


  }





  deleteAnnouncement(
    announcement: Announcement
  ): void {


    this.announcementToDelete = announcement;

    this.showDeleteModal = true;


  }





  cancelDelete(): void {

    this.showDeleteModal = false;

  }





  confirmDelete(): void {


    this.announcementService.delete(

      this.announcementToDelete!.id!

    ).subscribe(() => {


      this.refresh$.next();


      this.cancelDelete();


    });


  }





  isAdmin$ = this.authService.currentUser$.pipe(
    map(user => user?.role === 'ADMIN')
  );


  isHr$ = this.authService.currentUser$.pipe(
    map(user => user?.role === 'HR')
  );


  isEmployee$ = this.authService.currentUser$.pipe(
    map(user => user?.role === 'EMPLOYEE')
  );


}
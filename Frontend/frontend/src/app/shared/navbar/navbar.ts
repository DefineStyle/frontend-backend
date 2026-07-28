import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification-service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {


  private authService = inject(AuthService);

  private router = inject(Router);

  private elementRef = inject(ElementRef);

  private notificationService = inject(NotificationService);



  user$ = this.authService.currentUser$;


  isDropdownOpen = false;



  unreadNotification$ =
    this.notificationService.unread$;



  notifications$ =
    this.notificationService.notifications$;



  showNotificationModal = false;





  goHome() {

    this.router.navigate(['/']);

  }





  openNotifications() {

    this.showNotificationModal = true;

    this.notificationService.markAsRead();

  }





  closeNotifications() {

    this.showNotificationModal = false;

    this.notificationService.clearNotifications();

  }





  toggleDropdown(event: Event) {

    event.stopPropagation();

    this.isDropdownOpen = !this.isDropdownOpen;

  }





  logout() {

    this.authService.logout().subscribe({

      next: () => {

        this.isDropdownOpen = false;

        this.router.navigate(['/login']);

      },


      error: (err) => {

        console.error(
          'Logout failed:',
          err
        );

      }

    });

  }





  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {


    if (!this.elementRef.nativeElement.contains(event.target)) {

      this.isDropdownOpen = false;

    }


  }


}
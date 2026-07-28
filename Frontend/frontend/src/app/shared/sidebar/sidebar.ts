import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth'; // Adjust path if needed

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private authService = inject(AuthService);

  isCollapsed = false;

  @Output()
  collapsedChange = new EventEmitter<boolean>();

  // Use RxJS mapping to dynamically show/hide routes based on user role stream
  isAdmin$ = this.authService.currentUser$.pipe(map(user => user?.role === 'ADMIN'));
  isHr$ = this.authService.currentUser$.pipe(map(user => user?.role === 'HR'));
  isEmployee$ = this.authService.currentUser$.pipe(map(user => user?.role === 'EMPLOYEE'));

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }
}
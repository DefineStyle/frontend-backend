import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  showErrorModal = signal(false);

  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe({
      next: () => {

        this.authService.getCurrentUser().subscribe({

          next: () => {

            this.router.navigate(['/']);

          }

        });

      },
        error: () => {
          this.showErrorModal.set(true);
        }
      });
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }
}
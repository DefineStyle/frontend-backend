import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user'; // Adjust relative path if needed

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  currentUser: any = null;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Edit Form Fields
  showEditForm = false;
  editUsername = '';
  newPassword = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Could not retrieve your profile details.';
        this.cdr.detectChanges();
      }
    });
  }

  enableEditForm(): void {
    if (this.currentUser) {
      this.editUsername = this.currentUser.username;
      this.newPassword = ''; // Reset password field
      this.showEditForm = true;
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.errorMessage = '';
  }

  onUpdateCredentials(): void {
    if (!this.newPassword.trim()) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    // Username is not editable - only the password can change here
    const updatedUserPayload = {
      ...this.currentUser,
      username: this.currentUser.username,
      password: this.newPassword
    };

    this.userService.update(this.currentUser.id, updatedUserPayload).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Password updated successfully!';
        this.currentUser = updatedUser;
        this.showEditForm = false;
        this.errorMessage = '';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update password.';
        this.cdr.detectChanges();
      }
    });
  }
}
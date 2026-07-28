import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest,
  of
} from 'rxjs';

import {
  map,
  switchMap,
  catchError,
  shareReplay
} from 'rxjs/operators';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  private userService = inject(UserService);

  private fb = inject(FormBuilder);

  private refresh$ = new BehaviorSubject<void>(undefined);

  searchTerm$ = new BehaviorSubject<string>('');

  currentPage$ = new BehaviorSubject<number>(1);

  pageSize = 10;

  private allUsers$ = this.refresh$.pipe(
    switchMap(() =>
      this.userService.getAll().pipe(
        catchError(() => of([]))
      )
    ),
    shareReplay(1)
  );

  filteredUsers$ = combineLatest([
    this.allUsers$,
    this.searchTerm$
  ]).pipe(
    map(([users, term]) => {

      if (!term) return users;

      const cleanTerm = term
        .toLowerCase()
        .trim();

      return users.filter(user =>
        user.username
          ?.toLowerCase()
          .includes(cleanTerm)
      );

    })
  );

  vm$ = combineLatest([
    this.filteredUsers$,
    this.currentPage$
  ]).pipe(
    map(([filtered, currentPage]) => {

      const totalPages =
        Math.ceil(filtered.length / this.pageSize) || 1;

      const startIndex =
        (currentPage - 1) * this.pageSize;

      const paginated =
        filtered.slice(
          startIndex,
          startIndex + this.pageSize
        );

      return {

        filtered,

        paginated,

        currentPage,

        totalPages,

        pages: Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ),

        startEntry:
          filtered.length === 0
            ? 0
            : startIndex + 1,

        endEntry:
          Math.min(
            currentPage * this.pageSize,
            filtered.length
          )

      };

    })
  );

  showAddModal = false;

  editing = false;

  editingUserId: number | null = null;

  showDeleteModal = false;

  userToDelete: User | null = null;

  userForm = this.fb.group({

    username: [
      '',
      Validators.required
    ],

    password: [
      ''
    ],

    role: [
      'EMPLOYEE',
      Validators.required
    ]

  });

  onSearch(event: Event): void {

    this.searchTerm$.next(
      (event.target as HTMLInputElement).value
    );

    this.currentPage$.next(1);

  }

  goToPage(
    page: number,
    totalPages: number
  ): void {

    if (
      page >= 1 &&
      page <= totalPages
    ) {

      this.currentPage$.next(page);

    }

  }

  nextPage(
    totalPages: number
  ): void {

    if (
      this.currentPage$.value <
      totalPages
    ) {

      this.currentPage$.next(
        this.currentPage$.value + 1
      );

    }

  }

  prevPage(): void {

    if (
      this.currentPage$.value > 1
    ) {

      this.currentPage$.next(
        this.currentPage$.value - 1
      );

    }

  }

  openAddModal(): void {

    this.editing = false;

    this.editingUserId = null;

    this.userForm.reset({

      username: '',

      password: '',

      role: 'EMPLOYEE'

    });

    this.showAddModal = true;

  }

  closeAddModal(): void {

    this.showAddModal = false;

  }

  saveUser(): void {

    if (
      this.userForm.invalid
    ) return;

    const user: User = {

      username:
        this.userForm.value.username!,

      password:
        this.userForm.value.password ?? '',

      role:
        this.userForm.value.role!

    };

    const action$ =
      this.editing

        ? this.userService.update(
            this.editingUserId!,
            user
          )

        : this.userService.create(
            user
          );

    action$.subscribe(() => {

      this.refresh$.next();

      this.closeAddModal();

    });

  }

  editUser(user: User): void {

    this.editing = true;

    this.editingUserId = user.id!;

    this.userForm.patchValue({

      username: user.username,

      password: '',

      role: user.role

    });

    this.showAddModal = true;

  }

  deleteUser(user: User): void {

    this.userToDelete = user;

    this.showDeleteModal = true;

  }

  cancelDelete(): void {

    this.showDeleteModal = false;

  }

  confirmDelete(): void {

    this.userService.delete(
      this.userToDelete!.id!
    ).subscribe(() => {

      this.refresh$.next();

      this.cancelDelete();

    });

  }

}
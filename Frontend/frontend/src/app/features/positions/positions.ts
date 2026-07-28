import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, shareReplay } from 'rxjs/operators';

import { Position } from '../../core/models/position';
import { PositionService } from '../../core/services/position';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './positions.html',
  styleUrl: './positions.css'
})
export class Positions {

  private positionService = inject(PositionService);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  private refresh$ = new BehaviorSubject<void>(undefined);

  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);

  pageSize = 5;

  private allPositions$ = this.refresh$.pipe(
    switchMap(() =>
      this.positionService.getAll().pipe(
        catchError(() => of([] as Position[]))
      )
    ),
    shareReplay(1)
  );

  private allEmployees$ = this.employeeService.getAll().pipe(
    catchError(() => of([])),
    shareReplay(1)
  );

  filteredPositions$ = combineLatest([
    this.allPositions$,
    this.searchTerm$
  ]).pipe(
    map(([positions, term]) => {

      if (!term) return positions;

      const cleanTerm = term.toLowerCase().trim();

      return positions.filter(position =>
        position.title?.toLowerCase().includes(cleanTerm)
      );

    })
  );

  vm$ = combineLatest([
    this.filteredPositions$,
    this.allEmployees$,
    this.currentPage$
  ]).pipe(
    map(([filtered, employees, currentPage]) => {

      const withCounts = filtered.map(position => ({
        ...position,
        employeeCount: employees.filter(
          e => e.position?.id === position.id
        ).length
      }));

      const totalPages =
        Math.ceil(withCounts.length / this.pageSize) || 1;

      const startIndex =
        (currentPage - 1) * this.pageSize;

      const paginated =
        withCounts.slice(startIndex, startIndex + this.pageSize);

      return {
        filtered: withCounts,
        paginated,
        currentPage,
        totalPages,
        pages: Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ),
        startEntry:
          withCounts.length === 0
            ? 0
            : startIndex + 1,
        endEntry:
          Math.min(
            currentPage * this.pageSize,
            withCounts.length
          )
      };

    })
  );

  showAddModal = false;
  editing = false;
  editingPositionId: number | null = null;

  showDeleteModal = false;
  positionToDelete: Position | null = null;

  positionForm = this.fb.group({
    title: ['', Validators.required]
  });

  onSearch(event: Event): void {

    this.searchTerm$.next(
      (event.target as HTMLInputElement).value
    );

    this.currentPage$.next(1);

  }

  goToPage(page: number, totalPages: number): void {

    if (page >= 1 && page <= totalPages) {
      this.currentPage$.next(page);
    }

  }

  nextPage(totalPages: number): void {

    if (this.currentPage$.value < totalPages) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }

  }

  prevPage(): void {

    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }

  }

  openAddModal(): void {

    this.editing = false;
    this.editingPositionId = null;

    this.positionForm.reset({
      title: ''
    });

    this.showAddModal = true;

  }

  closeAddModal(): void {

    this.showAddModal = false;

  }

  savePosition(): void {

    if (this.positionForm.invalid) return;

    const position: Position = {
      title: this.positionForm.value.title!
    };

    const action$ = this.editing
      ? this.positionService.update(
          this.editingPositionId!,
          position
        )
      : this.positionService.create(position);

    action$.subscribe(() => {

      this.refresh$.next();

      this.closeAddModal();

    });

  }

  editPosition(position: Position): void {

    this.editing = true;

    this.editingPositionId = position.id!;

    this.positionForm.patchValue({
      title: position.title
    });

    this.showAddModal = true;

  }

  deletePosition(position: Position): void {

    this.positionToDelete = position;

    this.showDeleteModal = true;

  }

  cancelDelete(): void {

    this.showDeleteModal = false;

  }

  confirmDelete(): void {

    this.positionService.delete(
      this.positionToDelete!.id!
    ).subscribe(() => {

      this.refresh$.next();

      this.cancelDelete();

    });

  }

}

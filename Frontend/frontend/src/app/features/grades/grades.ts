import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { Grade } from '../../core/models/grade';
import { GradeService } from '../../core/services/grade';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grades.html',
  styleUrl: './grades.css'
})
export class Grades {
  private gradeService = inject(GradeService);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  private refresh$ = new BehaviorSubject<void>(undefined);
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 5;

  private allGrades$ = this.refresh$.pipe(
    switchMap(() => this.gradeService.getAll().pipe(catchError(() => of([])))),
    shareReplay(1)
  );

  private allEmployees$ = this.employeeService.getAll().pipe(
    catchError(() => of([])),
    shareReplay(1)
  );

  filteredGrades$ = combineLatest([this.allGrades$, this.searchTerm$]).pipe(
    map(([grades, term]) => {
      if (!term) return grades;
      const cleanTerm = term.toLowerCase().trim();
      return grades.filter(g => g.name?.toLowerCase().includes(cleanTerm));
    })
  );

  vm$ = combineLatest([this.filteredGrades$, this.allEmployees$, this.currentPage$]).pipe(
    map(([filtered, employees, currentPage]) => {
      const withCounts = filtered.map(grade => ({
        ...grade,
        employeeCount: employees.filter(e => e.grade?.id === grade.id).length
      }));

      const totalPages = Math.ceil(withCounts.length / this.pageSize) || 1;
      const startIndex = (currentPage - 1) * this.pageSize;
      const paginated = withCounts.slice(startIndex, startIndex + this.pageSize);

      return {
        filtered: withCounts,
        paginated,
        currentPage,
        totalPages,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
        startEntry: withCounts.length === 0 ? 0 : startIndex + 1,
        endEntry: Math.min(currentPage * this.pageSize, withCounts.length)
      };
    })
  );

  showAddModal = false;
  editing = false;
  editingGradeId: number | null = null;
  showDeleteModal = false;
  gradeToDelete: Grade | null = null;

  gradeForm = this.fb.group({ name: ['', Validators.required] });

  onSearch(event: Event): void {
    this.searchTerm$.next((event.target as HTMLInputElement).value);
    this.currentPage$.next(1);
  }

  goToPage(page: number, totalPages: number): void {
    if (page >= 1 && page <= totalPages) this.currentPage$.next(page);
  }

  nextPage(totalPages: number): void {
    if (this.currentPage$.value < totalPages) this.currentPage$.next(this.currentPage$.value + 1);
  }

  prevPage(): void {
    if (this.currentPage$.value > 1) this.currentPage$.next(this.currentPage$.value - 1);
  }

  openAddModal(): void {
    this.editing = false;
    this.editingGradeId = null;
    this.gradeForm.reset();
    this.showAddModal = true;
  }

  closeAddModal(): void { this.showAddModal = false; }

  saveGrade(): void {
    if (this.gradeForm.invalid) return;
    const grade = { name: this.gradeForm.value.name! } as Grade;
    const action$ = this.editing
      ? this.gradeService.update(this.editingGradeId!, grade)
      : this.gradeService.create(grade);

    action$.subscribe(() => { this.refresh$.next(); this.closeAddModal(); });
  }

  editGrade(grade: Grade): void {
    this.editing = true;
    this.editingGradeId = grade.id!;
    this.gradeForm.patchValue({ name: grade.name });
    this.showAddModal = true;
  }

  deleteGrade(grade: Grade): void { this.gradeToDelete = grade; this.showDeleteModal = true; }
  cancelDelete(): void { this.showDeleteModal = false; }
  confirmDelete(): void {
    this.gradeService.delete(this.gradeToDelete!.id!).subscribe(() => {
      this.refresh$.next();
      this.cancelDelete();
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { Department } from '../../core/models/department';
import { DepartmentService } from '../../core/services/department';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments {
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  private refresh$ = new BehaviorSubject<void>(undefined);
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 5;

  private allDepartments$ = this.refresh$.pipe(
    switchMap(() => this.departmentService.getAll().pipe(catchError(() => of([])))),
    shareReplay(1)
  );

  private allEmployees$ = this.employeeService.getAll().pipe(
    catchError(() => of([])),
    shareReplay(1)
  );

  filteredDepartments$ = combineLatest([this.allDepartments$, this.searchTerm$]).pipe(
    map(([departments, term]) => {
      if (!term) return departments;
      const cleanTerm = term.toLowerCase().trim();
      return departments.filter(d => d.name?.toLowerCase().includes(cleanTerm));
    })
  );

  vm$ = combineLatest([this.filteredDepartments$, this.allEmployees$, this.currentPage$]).pipe(
    map(([filtered, employees, currentPage]) => {
      const withCounts = filtered.map(dept => ({
        ...dept,
        employeeCount: employees.filter(e => e.department?.id === dept.id).length
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
  editingDepartmentId: number | null = null;
  showDeleteModal = false;
  departmentToDelete: Department | null = null;

  departmentForm = this.fb.group({ name: ['', Validators.required] });

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
    this.editingDepartmentId = null;
    this.departmentForm.reset();
    this.showAddModal = true;
  }

  closeAddModal(): void { this.showAddModal = false; }

  saveDepartment(): void {
    if (this.departmentForm.invalid) return;
    const dept = { name: this.departmentForm.value.name! } as Department;
    const action$ = this.editing
      ? this.departmentService.update(this.editingDepartmentId!, dept)
      : this.departmentService.create(dept);

    action$.subscribe(() => { this.refresh$.next(); this.closeAddModal(); });
  }

  editDepartment(dept: Department): void {
    this.editing = true;
    this.editingDepartmentId = dept.id!;
    this.departmentForm.patchValue({ name: dept.name });
    this.showAddModal = true;
  }

  deleteDepartment(dept: Department): void { this.departmentToDelete = dept; this.showDeleteModal = true; }
  cancelDelete(): void { this.showDeleteModal = false; }
  confirmDelete(): void {
    this.departmentService.delete(this.departmentToDelete!.id!).subscribe(() => {
      this.refresh$.next();
      this.cancelDelete();
    });
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, shareReplay, tap } from 'rxjs/operators';
import { Employee } from '../../core/models/employee';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  private refresh$ = new BehaviorSubject<void>(undefined);
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 10;

  departments$ = this.employeeService.getDepartments().pipe(shareReplay(1));
  
  // Array to cache resolved position bounds for lookup
  positionsList: any[] = [];

  // Intercept and cache positions array whenever retrieved
  positions$ = this.employeeService.getPositions().pipe(
    tap(positions => this.positionsList = positions || []),
    shareReplay(1)
  );

  grades$ = this.employeeService.getGrades().pipe(shareReplay(1));

  private allEmployees$ = this.refresh$.pipe(
    switchMap(() => this.employeeService.getAll().pipe(
      catchError(() => of([] as Employee[]))
    )),
    shareReplay(1)
  );

  filteredEmployees$ = combineLatest([this.allEmployees$, this.searchTerm$]).pipe(
    map(([employees, term]) => {
      const list = employees || [];
      if (!term) return list;
      const cleanTerm = term.toLowerCase().trim();
      return list.filter(emp => 
        emp.firstName?.toLowerCase().includes(cleanTerm) ||
        emp.lastName?.toLowerCase().includes(cleanTerm)
      );
    })
  );

  paginatedEmployees$ = combineLatest([this.filteredEmployees$, this.currentPage$]).pipe(
    map(([filtered, page]) => {
      const startIndex = (page - 1) * this.pageSize;
      return filtered.slice(startIndex, startIndex + this.pageSize);
    })
  );

  vm$ = combineLatest([this.filteredEmployees$, this.paginatedEmployees$, this.currentPage$]).pipe(
    map(([filtered, paginated, currentPage]) => ({
      filtered,
      paginated,
      currentPage,
      totalPages: Math.ceil(filtered.length / this.pageSize) || 1,
      pages: Array.from({ length: Math.ceil(filtered.length / this.pageSize) || 1 }, (_, i) => i + 1),
      startEntry: filtered.length === 0 ? 0 : (currentPage - 1) * this.pageSize + 1,
      endEntry: Math.min(currentPage * this.pageSize, filtered.length)
    }))
  );

  showAddModal = false;
  editing = false;
  editingEmployeeId: number | null = null;
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;

  employeeForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    hireDate: ['', Validators.required],
    departmentId: ['', Validators.required],
    positionId: ['', Validators.required],
    gradeId: ['', Validators.required]
  });

  // --- Pagination Logic ---
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

  // --- Modal Helpers ---
  openAddModal(): void {
    this.editing = false;
    this.editingEmployeeId = null;
    
    this.employeeForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      hireDate: '',
      departmentId: '',
      positionId: '',
      gradeId: ''
    });
    
    this.showAddModal = true;
  }

  closeAddModal(): void { this.showAddModal = false; }

  saveEmployee(): void {
    if (this.employeeForm.invalid) return;

    const positionId = this.employeeForm.value.positionId;
    const gradeId = this.employeeForm.value.gradeId;

    const employee = {
      ...this.employeeForm.value,
      department: { id: Number(this.employeeForm.value.departmentId) },
      position: { id: Number(positionId) },
      grade: { id: Number(gradeId) }
    } as Employee;

    const action$ = this.editing
      ? this.employeeService.update(this.editingEmployeeId!, employee)
      : this.employeeService.create(employee);

    action$.subscribe(() => { 
      this.refresh$.next(); 
      this.closeAddModal(); 
    });
  }

  editEmployee(employee: Employee): void {
    this.editing = true;
    this.editingEmployeeId = employee.id!;
    this.employeeForm.patchValue({
      ...employee,
      departmentId: employee.department?.id?.toString(),
      positionId: employee.position?.id?.toString(),
      gradeId: employee.grade?.id?.toString()
    });
    this.showAddModal = true;
  }

  deleteEmployee(employee: Employee): void { 
    this.employeeToDelete = employee; 
    this.showDeleteModal = true; 
  }
  
  cancelDelete(): void { this.showDeleteModal = false; }
  
  confirmDelete(): void {
    this.employeeService.delete(this.employeeToDelete!.id!).subscribe(() => {
      this.refresh$.next();
      this.cancelDelete();
    });
  }
}
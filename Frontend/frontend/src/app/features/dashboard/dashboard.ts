import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard-service';
import { DashboardStats } from '../../core/models/dashboard-model';
import { CommonModule } from '@angular/common';

// Import Chart.js essentials
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js'; 

Chart.register(...registerables); 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  stats$!: Observable<DashboardStats>;

  // Observables to feed chart configurations reactively
  deptChartData$!: Observable<any>;
  posChartData$!: Observable<any>;

  // Recent Hires State
  recentHires: any[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;

  // Shared chart options
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getDashboardStats();

    this.deptChartData$ = this.stats$.pipe(
      map(stats => ({
        labels: Object.keys(stats.employeesByDepartment || {}),
        datasets: [
          {
            data: Object.values(stats.employeesByDepartment || {}),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']
          }
        ]
      }))
    );

    this.posChartData$ = this.stats$.pipe(
      map(stats => ({
        labels: Object.keys(stats.employeesByPosition || {}),
        datasets: [
          {
            data: Object.values(stats.employeesByPosition || {}),
            label: 'Employees Count',
            backgroundColor: '#3b82f6',
            borderRadius: 6
          }
        ]
      }))
    );

    // Initial load of the first page of recent hires
    this.loadRecentHires(this.currentPage);
  }

  loadRecentHires(page: number): void {
    this.currentPage = page;
    this.dashboardService.getRecentHires(page, this.pageSize).subscribe({
      next: (response) => {
        this.recentHires = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Failed to load recent hires', err);
      }
    });
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get minEntry(): number {
    if (this.totalElements === 0) return 0;
    return (this.currentPage * this.pageSize) + 1;
  }

  get maxEntry(): number {
    const max = (this.currentPage + 1) * this.pageSize;
    return max > this.totalElements ? this.totalElements : max;
  }
}
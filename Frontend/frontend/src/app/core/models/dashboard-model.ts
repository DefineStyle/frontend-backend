export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalPositions: number;
  totalUsers: number;
  employeesByDepartment: { [key: string]: number };
  employeesByPosition: { [key: string]: number };
}
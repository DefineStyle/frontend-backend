package employee_management.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalEmployees;
    private long totalDepartments;
    private long totalPositions;
    private long totalUsers;
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> employeesByPosition;

    // Default constructor (important for Jackson serialization)
    public DashboardStatsDTO() {}

    // Parameterized constructor
    public DashboardStatsDTO(long totalEmployees, long totalDepartments, long totalPositions, long totalUsers,
                             Map<String, Long> employeesByDepartment, Map<String, Long> employeesByPosition) {
        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.totalPositions = totalPositions;
        this.totalUsers = totalUsers;
        this.employeesByDepartment = employeesByDepartment;
        this.employeesByPosition = employeesByPosition;
    }

    // Getters and Setters
    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalPositions() {
        return totalPositions;
    }

    public void setTotalPositions(long totalPositions) {
        this.totalPositions = totalPositions;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<String, Long> getEmployeesByDepartment() {
        return employeesByDepartment;
    }

    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) {
        this.employeesByDepartment = employeesByDepartment;
    }

    public Map<String, Long> getEmployeesByPosition() {
        return employeesByPosition;
    }

    public void setEmployeesByPosition(Map<String, Long> employeesByPosition) {
        this.employeesByPosition = employeesByPosition;
    }
}
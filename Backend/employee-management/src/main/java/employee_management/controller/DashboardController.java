package employee_management.controller;

import employee_management.dto.DashboardStatsDTO;
import employee_management.model.Employee;
import employee_management.repository.DepartmentRepository;
import employee_management.repository.EmployeeRepository;
import employee_management.repository.PositionRepository;
import employee_management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final UserRepository userRepository;

    public DashboardController(EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository,
                               PositionRepository positionRepository,
                               UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        // Map List<Object[]> to Map<String, Long>
        Map<String, Long> deptStats = employeeRepository.countEmployeesByDepartment().stream()
                .collect(Collectors.toMap(
                        row -> row[0] != null ? row[0].toString() : "Unknown Department",
                        row -> (Long) row[1]
                ));

        Map<String, Long> positionStats = employeeRepository.countEmployeesByPosition().stream()
                .collect(Collectors.toMap(
                        row -> row[0] != null ? row[0].toString() : "Unknown Position",
                        row -> (Long) row[1]
                ));

        DashboardStatsDTO stats = new DashboardStatsDTO(
                employeeRepository.count(),
                departmentRepository.count(),
                positionRepository.count(),
                userRepository.count(),
                deptStats,
                positionStats
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-hires")
    public ResponseEntity<Page<Employee>> getRecentHires(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        // Sorts by 'hireDate' in descending order (newest first)
        // NOTE: Change "hireDate" to whatever your field is named in your Employee entity (e.g., "hireDate", "createdAt")
        Pageable pageable = PageRequest.of(page, size, Sort.by(Employee::getHireDate).descending());
        
        Page<Employee> recentHires = employeeRepository.findAll(pageable);
        return ResponseEntity.ok(recentHires);
    }

}
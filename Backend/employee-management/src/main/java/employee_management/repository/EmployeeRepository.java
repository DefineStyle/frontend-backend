package employee_management.repository;

import employee_management.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // LEFT JOIN starting from Department ensures empty departments show up with a count of 0
    @Query("SELECT d.name, COUNT(e) FROM Department d LEFT JOIN Employee e ON e.department = d GROUP BY d.name")
    List<Object[]> countEmployeesByDepartment();

    // LEFT JOIN starting from Position ensures empty positions show up with a count of 0
    @Query("SELECT p.title, COUNT(e) FROM Position p LEFT JOIN Employee e ON e.position = p GROUP BY p.title")
    List<Object[]> countEmployeesByPosition();
}
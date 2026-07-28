package employee_management.service;

import employee_management.exception.EmployeeNotFoundException;
import employee_management.model.Department;
import employee_management.model.Employee;
import employee_management.model.Grade;
import employee_management.model.Position;
import employee_management.model.User;
import employee_management.repository.DepartmentRepository;
import employee_management.repository.EmployeeRepository;
import employee_management.repository.GradeRepository;
import employee_management.repository.PositionRepository;
import employee_management.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           PositionRepository positionRepository,
                           GradeRepository gradeRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.gradeRepository = gradeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional // Ensure seeding runs inside a transaction context
    public void init() {

        if (employeeRepository.count() > 0) {
            return;
        }

        // 1. Create departments
        Department it = departmentRepository.save(
                new Department(null, "IT")
        );

        Department hr = departmentRepository.save(
                new Department(null, "HR")
        );

        Department finance = departmentRepository.save(
                new Department(null, "Finance")
        );

        // 2. Create positions
        Position developer = positionRepository.save(
                new Position(
                        null,
                        "Developer"
                )
        );

        Position manager = positionRepository.save(
                new Position(
                        null,
                        "Manager"
                )
        );

        Position accountant = positionRepository.save(
                new Position(
                        null,
                        "Accountant"
                )
        );

        // 2b. Create grades
        Grade grade5 = gradeRepository.save(
                new Grade(null, "Grade 5")
        );

        Grade grade8 = gradeRepository.save(
                new Grade(null, "Grade 8")
        );

        Grade grade4 = gradeRepository.save(
                new Grade(null, "Grade 4")
        );

        // 3. Create and seed the ADMIN User Profile
        Employee adminEmployee = employeeRepository.save(
                new Employee(
                        null,
                        "Admin",
                        "User",
                        "admin@gmail.com",
                        "0600000000",
                        LocalDate.of(2026, 1, 1),
                        it,
                        manager,
                        grade8
                )
        );

        User adminUser = new User();
        adminUser.setUsername(adminEmployee.getEmail()); // admin@gmail.com
        adminUser.setRole("ADMIN");                      // 👈 Set role to ADMIN
        adminUser.setPassword(passwordEncoder.encode("admin123")); // 👈 Hashed password
        adminUser.setEmployee(adminEmployee);
        userRepository.save(adminUser);


        // 4. Create standard employees using addEmployee() (which defaults to ROLE_EMPLOYEE)
        addEmployee(
                new Employee(
                        null,
                        "John",
                        "Doe",
                        "john@example.com",
                        "0612345678",
                        LocalDate.of(2024, 1, 15),
                        hr,
                        manager,
                        grade8
                )
        );

        addEmployee(
                new Employee(
                        null,
                        "Sarah",
                        "Smith",
                        "sarah@example.com",
                        "0623456789",
                        LocalDate.of(2023, 6, 20),
                        finance,
                        accountant,
                        grade4
                )
        );

        addEmployee(
                new Employee(
                        null,
                        "Michael",
                        "Brown",
                        "michael@example.com",
                        "0634567890",
                        LocalDate.of(2025, 2, 10),
                        it,
                        developer,
                        grade5
                )
        );
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    @Transactional // Added transaction management
    public Employee addEmployee(Employee employee) {
        // 1. Ensure id is null for creation
        employee.setId(null);
        
        // 2. Save the Employee profile first
        Employee savedEmployee = employeeRepository.save(employee);

        // 3. Create the credentials User profile
        User autoUser = new User();
        autoUser.setUsername(savedEmployee.getEmail()); // email behaves as login username
        autoUser.setRole("EMPLOYEE");                  // Default role for standard employees
        
        // Set a secure, temporary fallback password
        String tempPassword = "TempPassword123!";
        autoUser.setPassword(passwordEncoder.encode(tempPassword));
        
        // Link the saved employee to the user credentials (sets foreign key)
        autoUser.setEmployee(savedEmployee);

        // 4. Persist the User record
        userRepository.save(autoUser);

        return savedEmployee;
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee updatedEmployee) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        employee.setFirstName(updatedEmployee.getFirstName());
        employee.setLastName(updatedEmployee.getLastName());
        employee.setEmail(updatedEmployee.getEmail());
        employee.setPhone(updatedEmployee.getPhone());
        employee.setHireDate(updatedEmployee.getHireDate());
        employee.setDepartment(updatedEmployee.getDepartment());
        employee.setPosition(updatedEmployee.getPosition());
        employee.setGrade(updatedEmployee.getGrade());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }

        employeeRepository.deleteById(id);
    }
}
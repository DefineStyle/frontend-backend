package employee_management.service;

import employee_management.exception.DepartmentNotFoundException;
import employee_management.model.Department;
import employee_management.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException(id));
    }

    public Department addDepartment(Department department) {
        department.setId(null);
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException(id));

        department.setName(updatedDepartment.getName());

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {

        if (!departmentRepository.existsById(id)) {
            throw new DepartmentNotFoundException(id);
        }

        departmentRepository.deleteById(id);
    }
}
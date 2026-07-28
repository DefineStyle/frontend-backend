package employee_management.exception;

public class DepartmentNotFoundException extends RuntimeException {

    public DepartmentNotFoundException(Long id) {
        super("Departments with id " + id + " was not found.");
    }
}
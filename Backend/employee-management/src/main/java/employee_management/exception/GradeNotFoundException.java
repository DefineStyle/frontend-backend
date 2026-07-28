package employee_management.exception;

public class GradeNotFoundException extends RuntimeException {

    public GradeNotFoundException(Long id) {
        super("Grade with id " + id + " was not found.");
    }
}

package employee_management.exception;

public class PositionNotFoundException extends RuntimeException {

    public PositionNotFoundException(Long id) {
        super("Position with id " + id + " was not found.");
    }
}
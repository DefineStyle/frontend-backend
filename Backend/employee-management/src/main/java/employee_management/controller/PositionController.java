package employee_management.controller;

import employee_management.model.Position;
import employee_management.service.PositionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@CrossOrigin("*")
public class PositionController {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<Position> getAllPositions() {
        return positionService.getAllPositions();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public Position getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping
    public Position addPosition(@RequestBody Position position) {
        return positionService.addPosition(position);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Position updatePosition(@PathVariable Long id,
                                   @RequestBody Position position) {
        return positionService.updatePosition(id, position);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
    }
}
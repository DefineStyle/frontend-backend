package employee_management.service;

import employee_management.exception.PositionNotFoundException;
import employee_management.model.Position;
import employee_management.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new PositionNotFoundException(id));
    }

    public Position addPosition(Position position) {

        position.setId(null);

        return positionRepository.save(position);
    }

    public Position updatePosition(Long id, Position updatedPosition) {

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new PositionNotFoundException(id));

        position.setTitle(updatedPosition.getTitle());

        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {

        if (!positionRepository.existsById(id)) {
            throw new PositionNotFoundException(id);
        }

        positionRepository.deleteById(id);
    }
}
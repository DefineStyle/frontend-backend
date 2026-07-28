package employee_management.service;

import employee_management.exception.GradeNotFoundException;
import employee_management.model.Grade;
import employee_management.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public Grade getGradeById(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException(id));
    }

    public Grade addGrade(Grade grade) {
        grade.setId(null);
        return gradeRepository.save(grade);
    }

    public Grade updateGrade(Long id, Grade updatedGrade) {

        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException(id));

        grade.setName(updatedGrade.getName());

        return gradeRepository.save(grade);
    }

    public void deleteGrade(Long id) {

        if (!gradeRepository.existsById(id)) {
            throw new GradeNotFoundException(id);
        }

        gradeRepository.deleteById(id);
    }
}

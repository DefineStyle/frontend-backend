package employee_management.service;

import employee_management.model.Announcement;
import employee_management.repository.AnnouncementRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @PostConstruct
    public void init() {

        if (announcementRepository.count() > 0) {
            return;
        }

        announcementRepository.save(new Announcement(
                null,
                "Welcome",
                "Welcome to the Employee Management System.",
                LocalDateTime.now()
        ));

        announcementRepository.save(new Announcement(
                null,
                "Meeting",
                "Monthly meeting will be held on Friday at 10:00 AM.",
                LocalDateTime.now()
        ));

        announcementRepository.save(new Announcement(
                null,
                "Reminder",
                "Remember to submit your leave requests before the end of the month.",
                LocalDateTime.now()
        ));
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
    }

    public Announcement addAnnouncement(Announcement announcement) {

        announcement.setId(null);
        announcement.setCreatedAt(LocalDateTime.now());

        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(Long id, Announcement updatedAnnouncement) {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        announcement.setTitle(updatedAnnouncement.getTitle());
        announcement.setMessage(updatedAnnouncement.getMessage());

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {

        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found");
        }

        announcementRepository.deleteById(id);
    }

}
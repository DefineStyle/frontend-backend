package employee_management.controller;

import employee_management.model.Announcement;
import employee_management.service.AnnouncementService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import employee_management.model.NotificationMessage;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin("*")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    
    private final SimpMessagingTemplate messagingTemplate;

    public AnnouncementController( AnnouncementService announcementService, SimpMessagingTemplate messagingTemplate) {
        this.announcementService = announcementService;
        this.messagingTemplate = messagingTemplate;

    }

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @GetMapping("/{id}")
    public Announcement getAnnouncementById(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping
    public Announcement create(
            @RequestBody Announcement announcement
    ) {


        Announcement saved =
                announcementService.addAnnouncement(announcement);



        messagingTemplate.convertAndSend(
                "/topic/announcements",
                new NotificationMessage(
                        saved.getTitle(),
                        saved.getMessage()
                )
        );


        return saved;

    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{id}")
    public Announcement updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {

        return announcementService.updateAnnouncement(id, announcement);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @DeleteMapping("/{id}")
    public void deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
    }


}
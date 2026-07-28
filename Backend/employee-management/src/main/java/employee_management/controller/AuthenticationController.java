package employee_management.controller;

import employee_management.dto.CurrentUserDto;
import employee_management.model.User;
import employee_management.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    private final UserRepository userRepository;

    public AuthenticationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/me")
    public CurrentUserDto me(Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow();

        Long employeeId = null;

        if (user.getEmployee() != null) {
            employeeId = user.getEmployee().getId();
        }

        return new CurrentUserDto(
                user.getUsername(),
                user.getRole(),
                employeeId
        );
    }

}
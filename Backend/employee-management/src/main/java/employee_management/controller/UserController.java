package employee_management.controller;

import employee_management.model.User;
import employee_management.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Fetch details of the currently authenticated session owner.
     * Accessible to ANY authenticated employee.
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("No active session found.");
        }
        // principal.getName() extracts the active user's username (email)
        return userService.getUserByUsername(principal.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    /**
     * Update user details.
     * Allowed if:
     * 1. The logged-in user has the ADMIN role.
     * 2. The logged-in user is modifying their own personal credentials.
     * We fetch the existing DB record to match against the active session's Principal name.
     */
    @PreAuthorize("hasRole('ADMIN') or isAuthenticated()")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user,
                           Principal principal) {
        
        // 1. Retrieve the existing user profile from the database
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            throw new RuntimeException("User not found with id: " + id);
        }

        // 2. Check if the currently logged-in user has the Admin role
        boolean isAdmin = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        // 3. Non-admins can only modify their own data (matching session name with database username)
        if (!isAdmin && !existingUser.getUsername().equals(principal.getName())) {
            throw new AccessDeniedException("You are not authorized to update this profile.");
        }

        // 4. Save and return updated user object
        return userService.updateUser(id, user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
package employee_management.controller;

import employee_management.model.ApiInfo;
import employee_management.service.HomeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping("/")
    public ApiInfo home() {
        return homeService.getApiInfo();
    }
}       
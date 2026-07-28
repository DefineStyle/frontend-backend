package employee_management.service;

import employee_management.model.ApiInfo;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

    public ApiInfo getApiInfo() {
        return new ApiInfo(
                "running",
                "Employee Management API",
                "1.0.0",
                "sss"
        );
    }
}
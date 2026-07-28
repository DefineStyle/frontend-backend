package employee_management.model;

public class ApiInfo {

    private String status;
    private String application;
    private String version;
    private String author;

    public ApiInfo() {
    }

    public ApiInfo(String status, String application, String version, String author) {
        this.status = status;
        this.application = application;
        this.version = version;
        this.author = author;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
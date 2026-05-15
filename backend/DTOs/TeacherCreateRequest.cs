namespace AttendanceSystem.Api.DTOs;

public class TeacherCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

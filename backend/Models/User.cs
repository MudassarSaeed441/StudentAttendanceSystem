namespace AttendanceSystem.Api.Models;

public enum UserRole
{
    Admin,
    Teacher
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
}

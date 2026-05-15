namespace AttendanceSystem.Api.DTOs;

public class ClassCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
    public int TeacherId { get; set; }
}

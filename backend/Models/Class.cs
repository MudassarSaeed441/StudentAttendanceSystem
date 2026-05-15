namespace AttendanceSystem.Api.Models;

public class Class
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
    public int TeacherId { get; set; }
    public Teacher? Teacher { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}

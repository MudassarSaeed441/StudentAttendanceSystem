namespace AttendanceSystem.Api.Models;

public class Student
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty; 
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}

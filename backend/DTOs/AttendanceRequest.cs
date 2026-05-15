namespace AttendanceSystem.Api.DTOs;

public class AttendanceRequest
{
    public int ClassId { get; set; }
    public List<StudentAttendance> Records { get; set; } = new();
}

public class StudentAttendance
{
    public int StudentId { get; set; }
    public bool IsPresent { get; set; }
}

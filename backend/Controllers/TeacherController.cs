using AttendanceSystem.Api.Data;
using AttendanceSystem.Api.DTOs;
using AttendanceSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AttendanceSystem.Api.Controllers;

[Authorize(Roles = "Teacher")]
[ApiController]
[Route("api/[controller]")]
public class TeacherController : ControllerBase
{
    private readonly AttendanceContext _context;

    public TeacherController(AttendanceContext context)
    {
        _context = context;
    }

    [HttpGet("my-classes")]
    public async Task<IActionResult> GetMyClasses()
    {
        var userIdString = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
        
        var userId = int.Parse(userIdString);
        var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
        
        if (teacher == null) return NotFound("Teacher profile not found.");

        var classes = await _context.Classes
            .Where(c => c.TeacherId == teacher.Id)
            .ToListAsync();

        return Ok(classes);
    }

    [HttpGet("class-students/{classId}")]
    public async Task<IActionResult> GetClassStudents(int classId)
    {
        var students = await _context.Enrollments
            .Where(e => e.ClassId == classId)
            .Select(e => e.Student)
            .ToListAsync();

        return Ok(students);
    }

    [HttpPost("mark-attendance")]
    public async Task<IActionResult> MarkAttendance([FromBody] AttendanceRequest request)
    {
        var today = DateTime.Today;

        // Remove existing attendance for today to allow updates
        var existing = _context.Attendances.Where(a => a.ClassId == request.ClassId && a.Date.Date == today);
        _context.Attendances.RemoveRange(existing);

        foreach (var record in request.Records)
        {
            _context.Attendances.Add(new Attendance
            {
                ClassId = request.ClassId,
                StudentId = record.StudentId,
                Date = today,
                IsPresent = record.IsPresent
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Attendance recorded successfully." });
    }
}

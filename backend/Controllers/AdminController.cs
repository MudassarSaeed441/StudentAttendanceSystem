using AttendanceSystem.Api.Data;
using AttendanceSystem.Api.DTOs;
using AttendanceSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AttendanceSystem.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AttendanceContext _context;

    public AdminController(AttendanceContext context)
    {
        _context = context;
    }

    // --- Students ---
    [HttpGet("students")]
    public async Task<IActionResult> GetStudents() => Ok(await _context.Students.ToListAsync());

    [HttpPost("students")]
    public async Task<IActionResult> CreateStudent([FromBody] Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return Ok(student);
    }

    [HttpPut("students/{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
    {
        if (id != student.Id) return BadRequest();
        _context.Entry(student).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("students/{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // --- Teachers ---
    [HttpGet("teachers")]
    public async Task<IActionResult> GetTeachers() => Ok(await _context.Teachers.Include(t => t.User).ToListAsync());

    [HttpPost("teachers")]
    public async Task<IActionResult> CreateTeacher([FromBody] TeacherCreateRequest request)
    {
        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Teacher
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var teacher = new Teacher
        {
            Name = request.Name,
            UserId = user.Id
        };
        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync();
        return Ok(teacher);
    }

    // --- Classes ---
    [HttpGet("classes")]
    public async Task<IActionResult> GetClasses() => Ok(await _context.Classes.Include(c => c.Teacher).ToListAsync());

    [HttpPost("classes")]
    public async Task<IActionResult> CreateClass([FromBody] ClassCreateRequest request)
    {
        var @class = new Class
        {
            Name = request.Name,
            ClassCode = request.ClassCode,
            TeacherId = request.TeacherId
        };
        _context.Classes.Add(@class);
        await _context.SaveChangesAsync();
        return Ok(@class);
    }

    // --- Enrollments ---
    [HttpPost("enroll")]
    public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentRequest request)
    {
        var enrollment = new Enrollment
        {
            StudentId = request.StudentId,
            ClassId = request.ClassId
        };
        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            Students = await _context.Students.CountAsync(),
            Teachers = await _context.Teachers.CountAsync(),
            Classes = await _context.Classes.CountAsync(),
            AttendanceToday = await _context.Attendances.CountAsync(a => a.Date.Date == DateTime.Today)
        };
        return Ok(stats);
    }
}

import { useState, useEffect } from 'react';
import { teacherService } from '../services/api';
import { LogOut, CheckCircle, XCircle, Save, ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/Logo.svg';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await teacherService.getMyClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectClass = async (cls) => {
    try {
      setSelectedClass(cls);
      const [studentsRes, attendanceRes] = await Promise.all([
        teacherService.getClassStudents(cls.id),
        teacherService.getClassAttendanceToday(cls.id)
      ]);
      setStudents(studentsRes.data);
      setIsLocked(attendanceRes.data.isLocked);

      const initial = {};
      const savedRecords = attendanceRes.data.records || {};
      
      studentsRes.data.forEach(s => {
        initial[s.id] = savedRecords[s.id] !== undefined ? savedRecords[s.id] : true;
      });
      setAttendance(initial);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAttendance = (studentId) => {
    if (isLocked) return;
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSubmit = async () => {
    try {
      const records = Object.keys(attendance).map(id => ({
        studentId: parseInt(id),
        isPresent: attendance[id]
      }));

      await teacherService.markAttendance({ classId: selectedClass.id, records });
      alert('Attendance saved successfully!');
      setSelectedClass(null);
    } catch (err) {
      alert('Error saving attendance.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <header className="flex-between" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={logo} alt="Logo" style={{ width: '80px', borderRadius: '0.5rem' }} />
          <div>
            <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen color="var(--primary)" size={24} /> Teacher Portal
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Welcome, <strong style={{ color: 'var(--text-main)' }}>{localStorage.getItem('username')}</strong>
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {!selectedClass ? (
        <>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>My Assigned Classes</h2>
          <div className="dashboard-grid">
            {classes.length === 0 ? (
              <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>You haven't been assigned any classes yet.</p>
              </div>
            ) : (
              classes.map(c => (
                <div
                  key={c.id}
                  className="glass-card"
                  style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border)' }}
                  onClick={() => handleSelectClass(c)}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>{c.name}</h3>
                  <span className="badge btn-outline" style={{ fontSize: '0.7rem' }}>{c.classCode}</span>
                  <div style={{ marginTop: '2rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Mark Attendance <span style={{ fontSize: '1.2rem' }}>→</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>{selectedClass.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{selectedClass.classCode} • {students.length} Students</p>
            </div>
            <button onClick={() => setSelectedClass(null)} className="btn btn-outline">
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student Code</th>
                  <th style={{ textAlign: 'center' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} onClick={() => toggleAttendance(s.id)} style={{ cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.8 : 1 }}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{s.name}</div>
                      {s.fatherName && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>S/O {s.fatherName}</div>}
                    </td>
                    <td><span style={{ opacity: 0.7 }}>{s.studentCode}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      {attendance[s.id] ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={14} /> Present
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <XCircle size={14} /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isLocked ? (
              <span style={{ color: 'var(--danger)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 Attendance locked (1 hour passed)
              </span>
            ) : (
              <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Save size={20} /> Submit Attendance
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

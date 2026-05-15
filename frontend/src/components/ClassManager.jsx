import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Plus, UserPlus, BookOpen } from 'lucide-react';

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacherId, setTeacherId] = useState('');
  
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollClassId, setEnrollClassId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [c, t, s] = await Promise.all([
        adminService.getClasses(),
        adminService.getTeachers(),
        adminService.getStudents()
      ]);
      setClasses(c.data);
      setTeachers(t.data);
      setStudents(s.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await adminService.createClass({ name, classCode: code, teacherId: parseInt(teacherId) });
      setName(''); setCode(''); setTeacherId('');
      fetchData();
    } catch (err) {
      alert('Error creating class. Class code must be unique.');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await adminService.enroll({ studentId: parseInt(enrollStudentId), classId: parseInt(enrollClassId) });
      setEnrollStudentId(''); setEnrollClassId('');
      alert('Student enrolled successfully!');
    } catch (err) {
      alert('Error enrolling student. They might already be enrolled in this class.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Plus size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Create New Class</h3>
        </div>
        <form onSubmit={handleCreateClass}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Class Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Mathematics" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Class Code</label>
            <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="MATH101" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Assign Teacher</label>
            <select className="input-field" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Class</button>
        </form>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <UserPlus size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Enroll Student</h3>
        </div>
        <form onSubmit={handleEnroll}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Student</label>
            <select className="input-field" value={enrollStudentId} onChange={(e) => setEnrollStudentId(e.target.value)} required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Class</label>
            <select className="input-field" value={enrollClassId} onChange={(e) => setEnrollClassId(e.target.value)} required>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.classCode})</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Enroll Student</button>
        </form>
      </div>

      <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <BookOpen size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Active Classes</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Code</th>
                <th>Assigned Teacher</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No classes created yet.</td>
                </tr>
              ) : (
                classes.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td><span className="badge btn-outline">{c.classCode}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {c.teacher?.name.charAt(0)}
                        </div>
                        {c.teacher?.name}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;

import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Plus, UserCheck } from 'lucide-react';

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await adminService.getTeachers();
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createTeacher({ name, username, password });
      setName('');
      setUsername('');
      setPassword('');
      fetchTeachers();
    } catch (err) {
      alert('Error creating teacher account. Username might already be taken.');
    }
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Teacher's Name" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
          <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="teacher_01" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
          <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
          <Plus size={18} /> Add Teacher
        </button>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No teachers registered yet.</td>
              </tr>
            ) : (
              teachers.map(t => (
                <tr key={t.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                      {t.name.charAt(0)}
                    </div>
                    {t.name}
                  </td>
                  <td>{t.user?.username}</td>
                  <td><span className="badge badge-success">Teacher</span></td>
                  <td><span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>Active</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherManager;

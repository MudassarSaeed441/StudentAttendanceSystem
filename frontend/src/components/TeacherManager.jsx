import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);

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
      if (editingId) {
        await adminService.updateTeacher(editingId, { name, username, password });
        setEditingId(null);
      } else {
        await adminService.createTeacher({ name, username, password });
      }
      setName('');
      setUsername('');
      setPassword('');
      fetchTeachers();
    } catch (err) {
      alert('Error saving teacher account. Username might already be taken.');
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setName(t.name);
    setUsername(t.user?.username || t.username || '');
    setPassword('');
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await adminService.deleteTeacher(id);
        fetchTeachers();
      } catch(err) {
        alert('Error deleting teacher.');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <X size={14} /> Cancel
          </button>
        )}
      </div>

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
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password {editingId && '(Leave blank to keep)'}</label>
          <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required={!editingId} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
          {editingId ? <Edit2 size={18} /> : <Plus size={18} />} 
          {editingId ? 'Update' : 'Add Teacher'}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No teachers registered yet.</td>
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
                  <td>{t.user?.username || t.username}</td>
                  <td><span className="badge badge-success">Teacher</span></td>
                  <td><span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>Active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(t)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '0.3rem' }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '0.3rem' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
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

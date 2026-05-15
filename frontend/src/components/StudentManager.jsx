import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Plus, Trash2, Edit, X } from 'lucide-react';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await adminService.getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateStudent(editingId, { id: editingId, name, studentCode: code });
      } else {
        await adminService.createStudent({ name, studentCode: code });
      }
      resetForm();
      fetchStudents();
    } catch (err) {
      alert('Error saving student. Make sure the code is unique.');
    }
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setEditingId(null);
  };

  const handleEdit = (s) => {
    setName(s.name);
    setCode(s.studentCode);
    setEditingId(s.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminService.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Student Name</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Student Code</label>
          <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="STU001" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? <Edit size={18} /> : <Plus size={18} />}
            {editingId ? 'Update' : 'Add Student'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn btn-outline">
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student Code</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No students found. Add one above!</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td><span className="badge btn-outline">{s.studentCode}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEdit(s)} className="btn btn-outline" style={{ padding: '0.4rem', marginRight: '0.5rem' }} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-danger" style={{ padding: '0.4rem' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
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

export default StudentManager;

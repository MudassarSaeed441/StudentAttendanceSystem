import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ArrowLeft, UserCheck, UserX, Calendar } from 'lucide-react';

const DailyAttendanceList = ({ status, onBack }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, [status]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTodayAttendance(status);
      setList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isPresent = status === 'present';

  return (
    <div className="glass-card" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: isPresent ? '#34d399' : '#f87171' }}>
            {isPresent ? <UserCheck size={24} /> : <UserX size={24} />}
            {isPresent ? 'Present' : 'Absent'} Students Today
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }} className="badge btn-outline">
          <Calendar size={14} />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading student list...</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No students are marked {isPresent ? 'present' : 'absent'} today.
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Father Name</th>
                <th>Class</th>
                <th>Student Code</th>
              </tr>
            </thead>
            <tbody>
              {list.map((student, idx) => (
                <tr key={student.studentId || idx}>
                  <td style={{ fontWeight: 500 }}>{student.studentName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{student.fatherName || '-'}</td>
                  <td>{student.className}</td>
                  <td>
                    <span className="badge btn-outline">{student.studentCode}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyAttendanceList;

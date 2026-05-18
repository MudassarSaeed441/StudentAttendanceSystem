import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { BarChart, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [filter, setFilter] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminService.getReports(filter);
      setReportData(response.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Attendance Reports</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            className="input-field" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="monthly_3">Last 3 Months</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading report data...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No data found for this period.</td>
                </tr>
              ) : (
                reportData.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{row.studentName || row.student?.name}</div>
                      {row.fatherName && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>S/O {row.fatherName}</div>}
                    </td>
                    <td>{row.className || row.class?.name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        {row.date ? new Date(row.date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${row.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;

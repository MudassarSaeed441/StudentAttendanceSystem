import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Users, UserCheck, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentManager from '../components/StudentManager';
import TeacherManager from '../components/TeacherManager';
import ClassManager from '../components/ClassManager';

import logo from '../assets/logo.jpg';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, attendanceToday: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <div className="sidebar">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '1rem', borderRadius: '0.5rem' }} />
          <h2 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Attendance</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Portal</p>
        </div>
        
        <button onClick={() => setActiveTab('overview')} className={`nav-link btn-link ${activeTab === 'overview' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LayoutDashboard size={20} /> Overview
        </button>
        <button onClick={() => setActiveTab('students')} className={`nav-link btn-link ${activeTab === 'students' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <Users size={20} /> Students
        </button>
        <button onClick={() => setActiveTab('teachers')} className={`nav-link btn-link ${activeTab === 'teachers' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <UserCheck size={20} /> Teachers
        </button>
        <button onClick={() => setActiveTab('classes')} className={`nav-link btn-link ${activeTab === 'classes' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <BookOpen size={20} /> Classes
        </button>
        
        <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="main-content">
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            <span>Welcome, <strong>Admin</strong></span>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="glass-card">
              <p style={{ color: 'var(--text-muted)' }}>Total Students</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.students}</h2>
            </div>
            <div className="glass-card">
              <p style={{ color: 'var(--text-muted)' }}>Total Teachers</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.teachers}</h2>
            </div>
            <div className="glass-card">
              <p style={{ color: 'var(--text-muted)' }}>Total Classes</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.classes}</h2>
            </div>
            <div className="glass-card">
              <p style={{ color: 'var(--text-muted)' }}>Attendance Today</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: 'var(--success)' }}>{stats.attendanceToday}</h2>
            </div>
          </div>
        )}

        {activeTab === 'students' && <StudentManager />}
        {activeTab === 'teachers' && <TeacherManager />}
        {activeTab === 'classes' && <ClassManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;

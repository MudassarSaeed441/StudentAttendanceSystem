import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Users, UserCheck, BookOpen, LayoutDashboard, LogOut, BarChart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentManager from '../components/StudentManager';
import TeacherManager from '../components/TeacherManager';
import ClassManager from '../components/ClassManager';
import Reports from '../components/Reports';
import DailyAttendanceList from '../components/DailyAttendanceList';

import logo from '../assets/Logo.svg';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, presentToday: 0, absentToday: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header for Sidebar Toggle */}
      <div className="mobile-header glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Logo" style={{ width: '40px', borderRadius: '0.2rem' }} />
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary)' }}>Admin Portal</h2>
        </div>
        <button className="btn btn-outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: '0.5rem' }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }} className="sidebar-logo">
          <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '1rem', borderRadius: '0.5rem' }} />
          <h2 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Attendance</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Portal</p>
        </div>

        <button onClick={() => handleTabChange('overview')} className={`nav-link btn-link ${activeTab === 'overview' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LayoutDashboard size={20} /> Overview
        </button>
        <button onClick={() => handleTabChange('students')} className={`nav-link btn-link ${activeTab === 'students' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <Users size={20} /> Students
        </button>
        <button onClick={() => handleTabChange('teachers')} className={`nav-link btn-link ${activeTab === 'teachers' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <UserCheck size={20} /> Teachers
        </button>
        <button onClick={() => handleTabChange('classes')} className={`nav-link btn-link ${activeTab === 'classes' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <BookOpen size={20} /> Classes
        </button>
        <button onClick={() => handleTabChange('reports')} className={`nav-link btn-link ${activeTab === 'reports' ? 'active' : ''}`} style={{ border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <BarChart size={20} /> Reports
        </button>

        <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="main-content">
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <h1>
            {activeTab === 'present-list' ? 'Present Students Today' :
              activeTab === 'absent-list' ? 'Absent Students Today' :
                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            <span>Welcome, <strong>Admin</strong></span>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="glass-card card-interactive" onClick={() => handleTabChange('students')} style={{ cursor: 'pointer' }}>
              <p style={{ color: 'var(--text-muted)' }}>Total Students</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.students}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.8 }}>Click to view list</span>
            </div>
            <div className="glass-card card-interactive" onClick={() => handleTabChange('teachers')} style={{ cursor: 'pointer' }}>
              <p style={{ color: 'var(--text-muted)' }}>Total Teachers</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.teachers}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.8 }}>Click to view list</span>
            </div>
            <div className="glass-card card-interactive" onClick={() => handleTabChange('classes')} style={{ cursor: 'pointer' }}>
              <p style={{ color: 'var(--text-muted)' }}>Total Classes</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.classes}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.8 }}>Click to view list</span>
            </div>
            <div className="glass-card card-interactive" onClick={() => handleTabChange('present-list')} style={{ cursor: 'pointer' }}>
              <p style={{ color: 'var(--text-muted)' }}>Present Today</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#34d399' }}>{stats.presentToday || 0}</h2>
              <span style={{ fontSize: '0.8rem', color: '#34d399', opacity: 0.8 }}>Click to view list</span>
            </div>
            <div className="glass-card card-interactive" onClick={() => handleTabChange('absent-list')} style={{ cursor: 'pointer' }}>
              <p style={{ color: 'var(--text-muted)' }}>Absent Today</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#f87171' }}>{stats.absentToday || 0}</h2>
              <span style={{ fontSize: '0.8rem', color: '#f87171', opacity: 0.8 }}>Click to view list</span>
            </div>
          </div>
        )}

        {activeTab === 'students' && <StudentManager />}
        {activeTab === 'teachers' && <TeacherManager />}
        {activeTab === 'classes' && <ClassManager />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'present-list' && <DailyAttendanceList status="present" onBack={() => setActiveTab('overview')} />}
        {activeTab === 'absent-list' && <DailyAttendanceList status="absent" onBack={() => setActiveTab('overview')} />}
      </div>
    </div>
  );
};

export default AdminDashboard;

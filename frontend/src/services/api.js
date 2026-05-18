import axios from 'axios';

const API_URL = 'http://jamiarahemiatajveedulquran.online/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const adminService = {
  getStudents: () => api.get('/admin/students'),
  createStudent: (student) => api.post('/admin/students', student),
  updateStudent: (id, student) => api.put(`/admin/students/${id}`, student),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  getTeachers: () => api.get('/admin/teachers'),
  createTeacher: (teacher) => api.post('/admin/teachers', teacher),
  updateTeacher: (id, teacher) => api.put(`/admin/teachers/${id}`, teacher),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),

  getClasses: () => api.get('/admin/classes'),
  createClass: (cls) => api.post('/admin/classes', cls),
  updateClass: (id, cls) => api.put(`/admin/classes/${id}`, cls),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),

  enroll: (data) => api.post('/admin/enroll', data),
  getStats: () => api.get('/admin/stats'),
  getTodayAttendance: (status) => api.get('/admin/today-attendance', { params: { status } }),
  getReports: (filter) => api.get('/admin/reports', { params: { filter } }),
};

export const teacherService = {
  getMyClasses: () => api.get('/teacher/my-classes'),
  getClassStudents: (classId) => api.get(`/teacher/class-students/${classId}`),
  getClassAttendanceToday: (classId) => api.get(`/teacher/class-attendance/${classId}`),
  markAttendance: (data) => api.post('/teacher/mark-attendance', data),
};

export default api;

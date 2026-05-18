import axios from 'axios';

const API_URL = 'https://jamiarahemiatajveedulquran.online/api';

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

  getClasses: () => api.get('/admin/classes'),
  createClass: (cls) => api.post('/admin/classes', cls),

  enroll: (data) => api.post('/admin/enroll', data),
  getStats: () => api.get('/admin/stats'),
};

export const teacherService = {
  getMyClasses: () => api.get('/teacher/my-classes'),
  getClassStudents: (classId) => api.get(`/teacher/class-students/${classId}`),
  markAttendance: (data) => api.post('/teacher/mark-attendance', data),
};

export default api;

import axios from 'axios';

const BASE_URL = 'http://localhost:7000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('medsim_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medsim_token');
      localStorage.removeItem('medsim_student');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login:  (studentId, password)  => api.post('/api/auth/login',  { studentId, password }),
  signup: (data)                 => api.post('/api/auth/signup',  data),
  logout: ()                     => api.post('/api/auth/logout'),
  me:     ()                     => api.get('/api/auth/me'),
};

// ── Session ───────────────────────────────────────────────────────────────
export const sessionAPI = {
  start:       (characterName, department) => api.post('/api/session/start', { characterName, department }),
  message:     (message, voiceMode)        => api.post('/api/session/message', { message, voiceMode }),
  examine:     (examination)               => api.post('/api/session/examine', { examination }),
  orderTest:   (testName)                  => api.post('/api/session/order-test', { testName }),
  checkDrugs:  (drugs)                     => api.post('/api/session/check-drugs', { drugs }),
  submit:      (data)                      => api.post('/api/session/submit', data),
  generateReport: (testName, department, transcript) => api.post('/api/session/generate-report', { testName, department, transcript }),
};

// ── History ───────────────────────────────────────────────────────────────
export const historyAPI = {
  list:        ()        => api.get('/api/history'),
  detail:      (caseId)  => api.get(`/api/history/${caseId}`),
  delete:      (caseId)  => api.delete(`/api/history/${caseId}`),
  leaderboard: ()        => api.get('/api/leaderboard'),
  exportPdf:   (caseId) => api.post('/api/history/export-pdf', { caseId }, { responseType: 'blob' }),
};

export default api;

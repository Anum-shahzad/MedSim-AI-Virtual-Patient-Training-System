import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('medsim_student');
    const token  = localStorage.getItem('medsim_token');
    if (stored && token) {
      setStudent(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (studentId, password) => {
    const res = await authAPI.login(studentId, password);
    localStorage.setItem('medsim_token', res.data.token);
    localStorage.setItem('medsim_student', JSON.stringify(res.data.student));
    setStudent(res.data.student);
    return res.data;
  };

  const signup = async (data) => {
    const res = await authAPI.signup(data);
    localStorage.setItem('medsim_token', res.data.token);
    localStorage.setItem('medsim_student', JSON.stringify(res.data.student));
    setStudent(res.data.student);
    return res.data;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('medsim_token');
    localStorage.removeItem('medsim_student');
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

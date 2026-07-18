import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import DashboardPage   from './pages/DashboardPage';
import CaseSetupPage   from './pages/CaseSetupPage';
import ConsultationPage from './pages/ConsultationPage';
import ReportPage      from './pages/ReportPage';
import HistoryPage     from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage    from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { student, loading } = useAuth();
  if (loading) return <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'}}>
    <div style={{width:40,height:40,border:'4px solid #EDE9FE',borderTopColor:'#7B5CFA',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
  </div>;
  return student ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { student, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/"          element={student ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login"     element={student ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/signup"    element={student ? <Navigate to="/dashboard" /> : <SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/setup"     element={<ProtectedRoute><CaseSetupPage /></ProtectedRoute>} />
      <Route path="/consult"   element={<ProtectedRoute><ConsultationPage /></ProtectedRoute>} />
      <Route path="/report"    element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
      <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*"          element={<Navigate to="/" />} />
    </Routes>
  );
}

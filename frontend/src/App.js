import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import AuthCallback from './components/AuthCallback';
import OnboardingFlow from './components/OnboardingFlow';
import ReminderSettings from './components/ReminderSettings';
import StudentList from './components/StudentList';
import StudentProfile from './components/StudentProfile';
import AddEditStudent from './components/AddEditStudent';
import AddAssessment from './components/AddAssessment';
import AssessmentHistory from './components/AssessmentHistory';
import NewCheckin from './components/NewCheckin';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Hide header on auth/onboarding pages
const HIDE_HEADER_PATHS = ['/login', '/auth/callback', '/onboarding'];

const AppLayout = () => {
  const location = useLocation();
  const hideHeader = HIDE_HEADER_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <div className="App">
      {!hideHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Onboarding (protected, no header) */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
        <Route path="/onboarding/reminders/:childId" element={<ProtectedRoute><ReminderSettings /></ProtectedRoute>} />

        {/* App routes (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
        <Route path="/students/new" element={<ProtectedRoute><AddEditStudent /></ProtectedRoute>} />
        <Route path="/students/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
        <Route path="/students/:id/edit" element={<ProtectedRoute><AddEditStudent /></ProtectedRoute>} />
        <Route path="/students/:id/checkin" element={<ProtectedRoute><NewCheckin /></ProtectedRoute>} />
        <Route path="/students/:id/assessments/new" element={<ProtectedRoute><AddAssessment /></ProtectedRoute>} />
        <Route path="/students/:id/assessments" element={<ProtectedRoute><AssessmentHistory /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;

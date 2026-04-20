import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ResumeScreening from './pages/ResumeScreening';
import EmployeeList from './pages/EmployeeList';
import InterviewPrep from './pages/InterviewPrep';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeePortal from './pages/EmployeePortal';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content w-full">
        <Routes>
          <Route path="/" element={<ProtectedRoute allowedRoles={['HR']}><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute allowedRoles={['HR']}><EmployeeList /></ProtectedRoute>} />
          <Route path="/resume-screen" element={<ProtectedRoute allowedRoles={['HR']}><ResumeScreening /></ProtectedRoute>} />
          <Route path="/interview-prep" element={<ProtectedRoute allowedRoles={['HR']}><InterviewPrep /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute allowedRoles={['HR']}><Attendance /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute allowedRoles={['HR']}><Payroll /></ProtectedRoute>} />
          <Route path="/my-portal" element={<ProtectedRoute allowedRoles={['Employee', 'HR']}><EmployeePortal /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user.role === 'HR' ? '/' : '/my-portal'} />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import About from './pages/About';
import WelcomePortal from './pages/WelcomePortal';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthSuccess from './pages/AuthSuccess';
import GoogleRoleSelection from './pages/GoogleRoleSelection';
import StudentPerformance from './pages/StudentPerformance';
import StudentAssignments from './pages/StudentAssignments';
import TutorAssignments from './pages/TutorAssignments';
import TutorClasses from './pages/TutorClasses';
import TutorStudentProgress from './pages/TutorStudentProgress';
import TutorFiles from './pages/TutorFiles';

import Layout from './components/Layout';
import RoleLayout from './components/RoleLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateClass from './pages/AdminCreateClass';
import AdminClasses from './pages/AdminClasses';
import AdminFeedback from './pages/AdminFeedback';
import AdminGallery from './pages/AdminGallery';
import TutorDashboard from './pages/TutorDashboard';
import ClassManagePage from './pages/ClassManagePage';

import StudentDashboard from './pages/StudentDashboard';
import StudentEnrollClass from './pages/StudentEnrollClass';
import StudentFiles from './pages/StudentFiles';
import AdminFiles from './pages/AdminFiles';
import StudentGamification from './pages/StudentGamification';
import StudentTimer from './pages/StudentTimer';
import StudentPayments from './pages/StudentPayments';
import AdminPayments from './pages/AdminPayments';
import PerformancePrediction from './components/PerformancePrediction';
import TutorPerformanceAnalytics from './pages/TutorPerformanceAnalytics';
import AdminReports from './pages/AdminReports';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <ErrorBoundary>
    <ToastProvider>
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/welcomeportal" element={<WelcomePortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/google-role-selection" element={<GoogleRoleSelection />} />

        {/* Admin Routes - Protected */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="create-class" element={<AdminCreateClass />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="files" element={<AdminFiles />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Route>

        {/* Tutor Routes - Protected */}
        <Route path="/tutor" element={<ProtectedRoute allowedRoles={['tutor']}><RoleLayout role="tutor" /></ProtectedRoute>}>
          <Route index element={<TutorDashboard />} />
          <Route path="assignments" element={<TutorAssignments />} />
          <Route path="sessions" element={<TutorClasses />} />
          <Route path="session/:id" element={<ClassManagePage />} />
          <Route path="files" element={<TutorFiles />} />
          <Route path="student-progress" element={<TutorStudentProgress />} />
          <Route path="analytics" element={<TutorPerformanceAnalytics />} />
        </Route>

        {/* Student Routes - Protected */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><RoleLayout role="student" /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="enroll" element={<StudentEnrollClass />} />
          <Route path="files" element={<StudentFiles />} />
          <Route path="performance" element={<StudentPerformance />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="achievements" element={<StudentGamification />} />
          <Route path="timer" element={<StudentTimer />} />
          <Route path="payments" element={<StudentPayments />} />
          <Route path="ai-prediction" element={<PerformancePrediction />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
    </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;

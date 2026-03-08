import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';

import Layout from './components/Layout';
import RoleLayout from './components/RoleLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const WelcomePortal = React.lazy(() => import('./pages/WelcomePortal'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const AuthSuccess = React.lazy(() => import('./pages/AuthSuccess'));
const GoogleRoleSelection = React.lazy(() => import('./pages/GoogleRoleSelection'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminCreateClass = React.lazy(() => import('./pages/AdminCreateClass'));
const AdminClasses = React.lazy(() => import('./pages/AdminClasses'));
const AdminFeedback = React.lazy(() => import('./pages/AdminFeedback'));
const AdminGallery = React.lazy(() => import('./pages/AdminGallery'));
const AdminFiles = React.lazy(() => import('./pages/AdminFiles'));
const AdminPayments = React.lazy(() => import('./pages/AdminPayments'));
const AdminReports = React.lazy(() => import('./pages/AdminReports'));

const TutorDashboard = React.lazy(() => import('./pages/TutorDashboard'));
const TutorAssignments = React.lazy(() => import('./pages/TutorAssignments'));
const TutorClasses = React.lazy(() => import('./pages/TutorClasses'));
const TutorFiles = React.lazy(() => import('./pages/TutorFiles'));
const TutorStudentProgress = React.lazy(() => import('./pages/TutorStudentProgress'));
const TutorPerformanceAnalytics = React.lazy(() => import('./pages/TutorPerformanceAnalytics'));
const ClassManagePage = React.lazy(() => import('./pages/ClassManagePage'));

const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const StudentEnrollClass = React.lazy(() => import('./pages/StudentEnrollClass'));
const StudentFiles = React.lazy(() => import('./pages/StudentFiles'));
const StudentPerformance = React.lazy(() => import('./pages/StudentPerformance'));
const StudentAssignments = React.lazy(() => import('./pages/StudentAssignments'));
const StudentGamification = React.lazy(() => import('./pages/StudentGamification'));
const StudentTimer = React.lazy(() => import('./pages/StudentTimer'));
const StudentPayments = React.lazy(() => import('./pages/StudentPayments'));
const PerformancePrediction = React.lazy(() => import('./components/PerformancePrediction'));

const App = () => {
  return (
    <ErrorBoundary>
    <ThemeProvider>
    <ToastProvider>
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </Router>
    </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

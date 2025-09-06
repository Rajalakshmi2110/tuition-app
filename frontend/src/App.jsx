import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import FileUpload from './features/FileUpload/FileUpload';
import StudentDashboard from './pages/StudentDashboard';
import StudentEnrollClass from './pages/StudentEnrollClass';
import StudentFiles from './pages/StudentFiles';
import AdminFiles from './pages/AdminFiles';
import StudentGamification from './pages/StudentGamification';
import StudentTimer from './pages/StudentTimer';

const App = () => {
  return (
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

        {/* Routes with Layout */}
        <Route element={<Layout />}>

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="create-class" element={<AdminCreateClass />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="files" element={<AdminFiles />} />
          </Route>

        </Route>

        {/* Tutor Routes with Sidebar */}
        <Route path="/tutor" element={<RoleLayout role="tutor" />}>
          <Route index element={<TutorDashboard />} />
          <Route path="assignments" element={<TutorAssignments />} />
          <Route path="sessions" element={<TutorClasses />} />
          <Route path="session/:id" element={<ClassManagePage />} />
          <Route path="files" element={<TutorFiles />} />
          <Route path="student-progress" element={<TutorStudentProgress />} />
        </Route>

        {/* Student Routes with Sidebar */}
        <Route path="/student" element={<RoleLayout role="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="enroll" element={<StudentEnrollClass />} />
          <Route path="files" element={<StudentFiles />} />
          <Route path="performance" element={<StudentPerformance />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="achievements" element={<StudentGamification />} />
          <Route path="timer" element={<StudentTimer />} />
        </Route>

        {/* Admin Routes with existing Layout */}
        <Route element={<Layout />}>
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="create-class" element={<AdminCreateClass />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="files" element={<AdminFiles />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import WelcomePortal from './pages/WelcomePortal';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Layout from './components/Layout';
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

          {/* Tutor Routes */}
          <Route path="/tutor">
            <Route index element={<TutorDashboard />} />
            <Route path="class/:id" element={<ClassManagePage />} />
            <Route path="upload" element={<FileUpload />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student">
            <Route index element={<StudentDashboard />} /> {/* /student */}
            <Route path="enroll" element={<StudentEnrollClass />} /> {/* /student/enroll */}
            <Route path="files" element={<StudentFiles />} /> {/* /student/files */}
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;

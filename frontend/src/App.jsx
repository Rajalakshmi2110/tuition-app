import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import WelcomePortal from './pages/WelcomePortal';
import Login from './pages/Login';
import Register from './pages/Register';

import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentEnrollClass from './pages/StudentEnrollClass';
import AdminCreateClass from './pages/AdminCreateClass';
import ClassManagePage from './pages/ClassManagePage';
import FileUpload from './features/FileUpload/FileUpload';
import StudentFiles from './pages/StudentFiles';
const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/welcomeportal" element={<WelcomePortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with shared Layout (header/footer/sidebar if any) */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/enroll" element={<StudentEnrollClass />} />
          <Route path="/admin/create-class" element={<AdminCreateClass />} />
          <Route path="/tutor/class/:id" element={<ClassManagePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<FileUpload />} />
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/upload" element={<FileUpload />} />
          <Route path="/student/upload" element={<FileUpload />} />
          <Route path="/student/files" element={<StudentFiles />} />

        </Route>

      </Routes>
    </Router>
  );
};

export default App;

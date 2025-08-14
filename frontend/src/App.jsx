import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import WelcomePortal from './pages/WelcomePortal';
import Login from './pages/Login';
import Register from './pages/Register';

import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateClass from './pages/AdminCreateClass';
import TutorDashboard from './pages/TutorDashboard';
import ClassManagePage from './pages/ClassManagePage';
import FileUpload from './features/FileUpload/FileUpload';
import StudentDashboard from './pages/StudentDashboard';
import StudentEnrollClass from './pages/StudentEnrollClass';
import StudentFiles from './pages/StudentFiles';

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/welcomeportal" element={<WelcomePortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with Layout */}
        <Route element={<Layout />}>

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="create-class" element={<AdminCreateClass />} />
            <Route path="upload" element={<FileUpload />} />
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
            <Route path="upload" element={<FileUpload />} /> {/* /student/upload */}
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;

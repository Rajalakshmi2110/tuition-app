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
        </Route>

      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HeroSection from './Pages/HeroSection';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>

  );
};

export default App;

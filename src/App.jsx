// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Optional
import Login from './Login';

// Pages
import Home from './pages/Home';
import ActiveMembers from './pages/ActiveMembers';
import InactiveMembers from './pages/InactiveMembers';
import EndingMembers from './pages/EndingMembers';
import Registration from './pages/Registration';
import Attendance from './pages/Attendance';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('kfitness_logged_in') === 'true';
  });

  // Show login page first
  if (!loggedIn) {
    return <Login onLogin={() => {
      localStorage.setItem('kfitness_logged_in', 'true');
      setLoggedIn(true);
    }} />;
  }

  return (
    <BrowserRouter basename="/K-fitness">
      <div>
        {/* ✅ Top Navbar */}
        <Navbar />

        {/* ✅ Page container with white background */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/active" element={<ActiveMembers />} />
            <Route path="/inactive" element={<InactiveMembers />} />
            <Route path="/ending" element={<EndingMembers />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </div>

        {/* ✅ Optional: Persistent Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

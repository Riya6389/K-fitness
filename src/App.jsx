// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ActiveMembers from './pages/ActiveMembers';
import InactiveMembers from './pages/InactiveMembers';
import EndingMembers from './pages/EndingMembers';
import Registration from './pages/Registration';
import Attendance from './pages/Attendance';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/active" element={<ActiveMembers />} />
            <Route path="/inactive" element={<InactiveMembers />} />
            <Route path="/ending" element={<EndingMembers />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

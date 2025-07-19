import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src="/logo.jpg" alt="K Fitness Logo" className="logo-img" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/active">Active Members</Link></li>
        <li><Link to="/inactive">Inactive Members</Link></li>
        <li><Link to="/ending">Ending Members</Link></li>
        <li><Link to="/register">Registration</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
      </ul>
    </nav>
  );
}

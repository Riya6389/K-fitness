// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo" className="logo-img" />
      </div>

      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/active">Active Members</NavLink></li>
        <li><NavLink to="/inactive">Inactive Members</NavLink></li>
        <li><NavLink to="/ending">Ending Members</NavLink></li>
        <li><NavLink to="/register">Registration</NavLink></li>
        <li><NavLink to="/attendance">Attendance</NavLink></li>
      </ul>
    </nav>
  );
}

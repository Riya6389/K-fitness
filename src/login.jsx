// src/Login.jsx
import React, { useState } from 'react';
import './Login.css';

 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      onLogin(); // call parent function to set loggedIn to true
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="left-section">
  <div className="branding">
    <h1>
      <span className="welcome-text">Welcome to </span>
      <span className="brand-name">K Fitness</span>
    </h1>
    <p className="motive-text">
      Train hard. Stay fit. Achieve your goals with us. <br />
      Login to track your progress and reach new levels!
    </p>
  </div>
</div>

        <div className="right-section">
          <div className="login-box">
            <h2 className="login-title">User Login</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

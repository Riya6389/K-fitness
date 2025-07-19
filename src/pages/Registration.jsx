import React from 'react';
import './Registration.css';

export default function Registration() {
  return (
    <div className="registration-container">
      <h1>🏋️ Member Registration</h1>

      {/* Registration Form */}
      <form className="form-box">
        <h2>New Member Registration</h2>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="tel" placeholder="Phone Number" required />
        <input type="number" placeholder="Age" required />
        <input type="text" placeholder="Location" required />

        <select required>
          <option value="">Select Category</option>
          <option value="dance">Dance</option>
          <option value="zumba">Zumba</option>
          <option value="yoga">Yoga</option>
          <option value="aerobics">Aerobics</option>
        </select>

        <input type="number" placeholder="Weight (kg)" required />
        <input type="number" placeholder="Height (cm)" required />

        <select required>
          <option value="">Membership Plan</option>
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="1year">1 Year</option>
        </select>

        <input type="date" placeholder="Start Date" required />
        <button type="submit" className="submit-btn">Register</button>
      </form>

      <div className="update-delete-section">
        {/* Update Form */}
        <form className="form-box half-box">
          <h2>Update Member Info</h2>
          <input type="text" placeholder="Full Name" required />
          <input type="tel" placeholder="Phone Number" required />
          <input type="date" placeholder="New Start Date" required />
          <select>
            <option value="">New Category</option>
            <option value="dance">Dance</option>
            <option value="zumba">Zumba</option>
            <option value="yoga">Yoga</option>
            <option value="aerobics">Aerobics</option>
          </select>
          <button type="submit" className="submit-btn">Update</button>
        </form>

        {/* Delete Form */}
        <form className="form-box half-box">
          <h2>Delete Member</h2>
          <input type="text" placeholder="Full Name" required />
          <input type="tel" placeholder="Phone Number" required />
          <button type="submit" className="delete-btn">Delete</button>
        </form>
      </div>
    </div>
  );
}

// Navbar.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../App.css';

const Navbar = ({ name, rollNo, onProfileClick }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <h2>Student Portal</h2>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <p className="user-name">Hi, {name}</p>
          <small className="roll-no">{rollNo}</small>
        </div>
        <button onClick={onProfileClick} className="profile-button">
          <FaUserCircle />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

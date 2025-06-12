import React from 'react';
import '../App.css'; 

const Navbar = ({ name, rollNo }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>Student Portal</h2>
      </div>
      <div className="nav-right">
        <p>Hi! {name}</p>
        <small>{rollNo}</small>
      </div>
    </nav>
  );
};

export default Navbar;

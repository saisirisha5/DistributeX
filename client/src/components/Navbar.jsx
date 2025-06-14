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
/*
 <Navbar name={user?.name} rollNo={profile?.rollNo} />
      <div className="p-6">
        {!profile ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="grade" placeholder="Grade" onChange={handleChange} className="w-full border p-2 rounded" required />
              <input name="institution" placeholder="Institution" onChange={handleChange} className="w-full border p-2 rounded" required />
              <input name="rollNo" placeholder="Roll No" onChange={handleChange} className="w-full border p-2 rounded" required />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
            </form>
          </div>
        ) : (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">You can now enroll in tests, check results and more.</p>
          </div>
        )}
      </div>

 */
import React, { useState } from 'react';
import { signupUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../components/GoogleLogin';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

   const [role, setRole] = useState('student'); 

  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signupUser(form);
      alert('Signup successful');
      console.log(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </form>
        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

        {/* Signup with Google */}
          <div className="my-4" />
            <p className="text-center text-gray-500">OR</p>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Select Role for Google Login:&nbsp;&nbsp;
              </label>
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>

              <div className="mt-4">
                <GoogleLogin role={role} />
              </div>
            </div>


      </div>
    </div>
  );
};

export default Signup;

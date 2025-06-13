import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';


const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      alert('Login successful');

      // Save token and user
      localStorage.setItem('token', data.token);
     

      console.log(data);
      localStorage.setItem('user', JSON.stringify(data.user));

      const role = data.user.role;

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/home');
      } else if (role === 'student') {
        navigate('/student/home');
      } else {
        navigate('/unauthorized');
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

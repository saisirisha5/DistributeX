//Main Home Page (for login and signup)
import React from "react";
import { useNavigate } from "react-router-dom";
import { Code } from "lucide-react"; // Optional: if you're using lucide icons

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-300 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          {/* Icon */}
          <div className="bg-blue-600 p-3 rounded-full">
            <Code className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome to DistributeX</h1>
        <p className="text-gray-600 mb-8">Manage tests, achievements & progress easily</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

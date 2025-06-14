import React, { useState } from "react";
import api from "../../services/api";

const CompleteProfileForm = ({ onProfileComplete }) => {
  const [formData, setFormData] = useState({
    grade: "",
    institution: "",
    rollNo: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/student/update", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      onProfileComplete(res.data.profile);  // callback to StudentHome
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="grade" placeholder="Grade" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="institution" placeholder="Institution" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="rollNo" placeholder="Roll No" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CompleteProfileForm;

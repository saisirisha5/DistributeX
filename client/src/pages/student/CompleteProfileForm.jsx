// CompleteProfileForm.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const CompleteProfileForm = ({ onProfileComplete, onClose, existingProfile = {}, existingUser = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    institution: "",
    rollNo: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: existingUser?.name || "",
      grade: existingProfile?.grade || "",
      institution: existingProfile?.institution || "",
      rollNo: existingProfile?.rollNo || ""
    });
  }, [existingUser, existingProfile]);

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
      onProfileComplete(res.data.profile);  // update parent state
      onClose(); // close modal
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-lg">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" className="w-full border p-2 rounded" required />
          <input name="institution" value={formData.institution} onChange={handleChange} placeholder="Institution" className="w-full border p-2 rounded" required />
          <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll No" className="w-full border p-2 rounded" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Update</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileForm;

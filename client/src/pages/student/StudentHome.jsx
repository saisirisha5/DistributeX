import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const StudentHome = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ grade: "", institution: "", rollNo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get("/student/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setUser(res.data.user);
        if (res.data.hasProfile) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/student/update", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
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
    </>
  );
};

export default StudentHome;

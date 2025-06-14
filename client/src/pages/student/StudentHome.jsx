// StudentHome.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import CompleteProfileForm from "./CompleteProfileForm";
import { Link } from "react-router-dom";

const StudentHome = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get("/student/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data.user);
        if (res.data.hasProfile) setProfile(res.data.profile);
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <Navbar
        name={user?.name}
        rollNo={profile?.rollNo}
        onProfileClick={() => setShowProfileModal(true)}
      />
      <div className="p-6">
        {!profile ? (
          <CompleteProfileForm onProfileComplete={setProfile} />
        ) : (
          <>
            <div className="text-center mt-8 mb-6">
              <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
              <p className="text-gray-600">You can now enroll in tests, check results and more.</p>
            </div>
          </>
        )}
      </div>
      <Link to="/student/tests">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Browse Tests</button>
      </Link>

      <Link to="/student/tests/viewEnrolled">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">View Enrolled Tests</button>
      </Link>
      
      {showProfileModal && (
        <CompleteProfileForm
          onClose={() => setShowProfileModal(false)}
          onProfileComplete={setProfile}
          existingProfile={profile}
          existingUser={user}
        />
      )}
    </>
  );
};

export default StudentHome;

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStats,
  getTeacherApplications,
  updateTeacherStatus
} from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0,tests : 0});
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fetchApplications = useCallback(async () => {
    try {
      const data = await getTeacherApplications(token);
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  }, [token]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await getStats(token);
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStatsData();
    fetchApplications();
  }, [fetchApplications, token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTeacherStatus(id, status, token);
      fetchApplications();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: '2rem' }}>
        <p>Total Students: <strong>{stats.students}</strong></p>
        <p>Total Teachers: <strong>{stats.teachers}</strong></p>
        <p>Total Tests: <strong>{stats.tests}</strong></p>
      </div>
        <button
        onClick={() => navigate('/admin/tests')}
        style={{
          marginBottom: '2rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        View All Tests
      </button>

      <h3>Teacher Applications</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Qualifications</th>
            <th>Subjects</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td>{app.user?.name}</td>
              <td>{app.user?.email}</td>
              <td>{app.status}</td>
              <td>{app.qualifications}</td>
              <td>{app.subjects.join(', ')}</td>
              <td>{app.bio}</td>
              <td>
                {app.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'accepted')}
                      style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px' }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
                    >
                      Reject
                    </button>
                  </>
                ) : app.status === 'accepted' ? (
                  <span style={{ color: 'green' }}>✔️ Approved</span>
                ) : (
                  <span style={{ color: 'red' }}>❌ Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

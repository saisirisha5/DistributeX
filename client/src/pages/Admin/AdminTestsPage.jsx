import React, { useEffect, useState } from 'react';
import { getAllTests } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminTestsPage = () => {
  const [tests, setTests] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // ✅ Hook for navigation

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getAllTests(token);
        setTests(data);
      } catch (err) {
        console.error('Error fetching tests:', err);
      }
    };

    fetchTests();
  }, [token]);

  const handleRowClick = (id) => {
    navigate(`/test/details/${id}`); // ✅ Navigate to detail page
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Tests</h2>
      {tests.length === 0 ? (
        <p>No tests available.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ cursor: 'pointer' }}>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Teacher</th>
              <th>Premium</th>
              <th>Threshold</th>
              <th>Enrolled Count</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test._id} onClick={() => handleRowClick(test._id)}>
                <td>{test.name}</td>
                <td>{test.teacher?.user?.name || 'N/A'}</td>
                <td>{test.isPremium ? 'Yes' : 'No'}</td>
                <td>{test.threshold}</td>
                <td>{test.enrolledCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTestsPage;

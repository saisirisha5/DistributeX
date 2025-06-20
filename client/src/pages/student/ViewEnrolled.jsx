import React, { useEffect, useState } from 'react';
import { getEnrolledTests } from '../../services/studentService';
import { Link } from 'react-router-dom';

const ViewEnrolled = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getEnrolledTests(token);
        setTests(data);
      } catch (err) {
        console.error('Error fetching enrolled tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Enrolled Tests</h2>
      {tests.length === 0 ? (
        <p>No tests enrolled yet.</p>
      ) : (
        <table  border="1" cellPadding="10" style={{ cursor: 'pointer' }}>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((attempts, idx) => (
              <tr key={idx}>
                <td>{attempts.test?.name}</td>
                <td>{new Date(attempts.selectedDate).toDateString()}</td>
                <td>
                {attempts.selectedSlot?.startTime} - {attempts.selectedSlot?.endTime}
                </td>
                <td>{attempts.selectedPlace?.name}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6 text-center">
        <br/><Link to="/student/home" className="text-blue-600 underline">← Back to Home</Link>
      </div>
    </div>
  );
};

export default ViewEnrolled;

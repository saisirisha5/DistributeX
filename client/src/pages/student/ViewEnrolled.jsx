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
        <table className="w-full border border-gray-500 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-500">Test Name</th>
              <th className="p-2 border border-gray-500">Date</th>
              <th className="p-2 border border-gray-500">Time Slot</th>
              <th className="p-2 border border-gray-500">Location</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((attempts, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border border-gray-500">{attempts.test?.name}</td>
                <td className="p-2 border border-gray-500">{new Date(attempts.selectedDate).toDateString()}</td>
                <td className="p-2 border border-gray-500">
                {attempts.selectedSlot?.startTime} - {attempts.selectedSlot?.endTime}
                </td>
                <td className="p-2 border border-gray-500">{attempts.selectedPlace?.name}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6 text-center">
        <Link to="/student/home" className="text-blue-600 underline">← Back to Home</Link>
      </div>
    </div>
  );
};

export default ViewEnrolled;

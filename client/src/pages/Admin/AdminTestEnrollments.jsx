import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const AdminTestEnrollments = () => {
  const { id } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [testName, setTestName] = useState('');
  const [remainingSlots, setRemainingSlots] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get(`/admin/test/${id}/enrollments`);
        setEnrollments(res.data.enrollments);
        setTestName(res.data.testName);
        setRemainingSlots(res.data.remainingSlots);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [id]);

  if (loading) return <p>Loading enrolled students...</p>;

  return (
    <div>
      <h2>Enrolled Students for {testName}</h2>
      <h4>Remaining slots: {remainingSlots}</h4>
      {Array.isArray(enrollments) && enrollments.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <ol>
          {enrollments.map((entry, idx) => (
            <li key={idx} style={{ marginBottom: '20px' }}>
              <u><strong>{entry.student.name}</strong></u> ({entry.student.email})<br />
              <ul>
                Roll No    : {entry.student.rollNo} | Grade: {entry.student.grade} | Institution: {entry.student.institution}<br />
                Date       : {new Date(entry.selectedDate).toDateString()}<br />
                Time       : {entry.selectedSlot.startTime} - {entry.selectedSlot.endTime}<br />
                Location   : {entry.selectedPlace.name}<br />
                Payment    : {entry.paymentStatus}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default AdminTestEnrollments;

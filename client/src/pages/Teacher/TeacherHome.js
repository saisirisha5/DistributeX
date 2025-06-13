import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeacherApplication, submitTeacherApplication } from '../../services/teacherService';

const TeacherHome = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    qualifications: '',
    subjects: '',
    bio: '',
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Fetch teacher application status
  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await fetchTeacherApplication();
        setApplication(data);
      } catch (err) {
        console.error('Failed to fetch application:', err);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await submitTeacherApplication(form);
      setMessage(data.message);
      setApplication({ applied: true, status: 'pending' }); // optimistic update
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Application failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Teacher Dashboard</h2>

      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {!application?.applied ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
          }}
        >
          <div>
            <label>Qualifications:</label>
            <input
              type="text"
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Subjects (comma separated):</label>
            <input
              type="text"
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Apply as Mentor</button>
        </form>
      ) : (
        <div>
          <p>You have already applied to become a mentor.</p>
          <p>
            Current application status: <strong>{application.status}</strong>
          </p>

          {application?.status === 'accepted' && (
            <button onClick={() => navigate('/teacher/dashboard')}>
              Go to teacher dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherHome;

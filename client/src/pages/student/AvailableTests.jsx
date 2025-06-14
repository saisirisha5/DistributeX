import React, { useEffect, useState } from 'react';
import {getAllTests} from '../../services/studentService';
import { useNavigate } from 'react-router-dom';

const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getAllTests(token);
            console.log("API tests:", data);
            const testData = Array.isArray(data) ? data : [];
            setTests(testData);
            setFilteredTests(testData);
        } catch (err) {
            console.error('Error fetching tests:', err);
            setTests([]);
            setFilteredTests([]);
        } finally {
            setLoading(false);
        }
        };
    fetchTests();
  }, []);


  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tests.filter(t => t.name.toLowerCase().includes(term));
    setFilteredTests(filtered);
  };

  const navigate = useNavigate();
  const handleEnroll = (testId) => {
    navigate(`/student/tests/enroll/${testId}`);
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading tests...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <input
        type="text"
        placeholder="Search tests..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow"
      />

      {filteredTests.length === 0 ? (
        <p className="text-center text-gray-500">No tests found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <div key={test._id} className="p-4 border rounded-lg shadow hover:shadow-md">
              <h2 className="text-xl font-bold mb-2">{test.name}</h2>
              <p className="text-gray-700">Teacher: {test.teacher?.user?.name || "N/A"}</p>
              <p className="text-gray-500 text-sm">Threshold: {test.threshold}</p>

              {test.enrolledCount >= test.threshold ? (
                <p className="mt-2 text-red-600 font-semibold">Not Available</p>
              ) : (
                <button
                  onClick={() => handleEnroll(test._id)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                  Enroll
                </button>

              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTests;

import api from './api';

// Get all tests
export const getAllTests = async (token) => {
  const res = await api.get('student-test/tests', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Get test by ID
export const getTestById = (id, token) =>
  api.get(`student-test/tests/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Enroll in a test
export const enrollInTest = (testId, data, token) =>
  api.post('student-test/tests/enroll', { testId, ...data }, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Get enrolled tests (VIEW ENROLLED TESTS)
export const getEnrolledTests = async (token) => {
  const res = await api.get('student-test/tests/viewEnrolled', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


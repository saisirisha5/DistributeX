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

// Create a payment order for premium tests
export const createOrder = async (payload, token) => {
  const res = await api.post('student-test/tests/createOrder', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; 
};

//Once payment is done, verify it and then enroll the student
export const verifyPayment = async (paymentData, token) =>
{
    const res= await api.post('student-test/tests/verifyPayment', paymentData, {
    headers: { Authorization: `Bearer ${token}` }
    });
   return res.data;
};
  

  
// export const getTestAttemptForStudent = async (testId, token) => {
//   const res = await api.get(`student-test/tests/enroll/${testId}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// }
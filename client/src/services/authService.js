//routing on client side
import api from './api';

export const signupUser = async (formData) => {
  const res = await api.post('/auth/signup', formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await api.post('/auth/login', formData);
  return res.data;
};


import api from './api';

export const getStats = async (token) => {
  const res = await api.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getTeacherApplications = async (token) => {
  const res = await api.get('/admin/teachers', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTeacherStatus = async (id, status, token) => {
  await api.patch(`/admin/teacher/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

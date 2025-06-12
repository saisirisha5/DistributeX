
import api from './api';

export const fetchTeacherApplication = async () => {
  const res = await api.get('/teacher/application');
  return res.data;
};

export const submitTeacherApplication = async (formData) => {
  const formattedForm = {
    ...formData,
    subjects: typeof formData.subjects === 'string'
      ? formData.subjects.split(',').map((s) => s.trim())
      : formData.subjects,
  };

  const res = await api.post('/teacher/apply', formattedForm);
  return res.data;
};

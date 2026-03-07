import api from '../services/api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

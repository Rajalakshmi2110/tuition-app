import API_CONFIG from './apiConfig';

const fileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default fileUrl;

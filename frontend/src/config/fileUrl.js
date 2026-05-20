import API_CONFIG from './apiConfig';

const fileUrl = (path, resourceId) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Local files - serve through backend
  if (resourceId && path.startsWith('uploads/')) {
    return `${API_CONFIG.BASE_URL}/api/resources/view/${resourceId}`;
  }
  return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default fileUrl;

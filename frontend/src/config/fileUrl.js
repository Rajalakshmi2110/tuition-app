import API_CONFIG from './apiConfig';

const fileUrl = (path, resourceId) => {
  if (!path) return '';
  // For Cloudinary files, use the backend proxy to get signed URL
  if (path.includes('cloudinary') && resourceId) {
    return `${API_CONFIG.BASE_URL}/api/resources/view/${resourceId}`;
  }
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default fileUrl;

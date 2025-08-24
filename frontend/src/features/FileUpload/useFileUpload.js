import { useState } from 'react';
import { uploadFile } from '../../api/fileService';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const upload = async (file, token) => {
    setUploading(true);
    setError(null);
    setMessage('');
    try {
      const data = await uploadFile(file, token);
      setMessage(data.message || 'Upload successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, message, upload };
}

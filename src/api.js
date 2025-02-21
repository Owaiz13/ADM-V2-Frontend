import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000';

export const uploadApk = async (file) => {
  const formData = new FormData();
  formData.append('apkfile', file); // The field name should match what the backend expects

  try {
    const response = await axios.post(`${API_BASE_URL}/decompile_jadx`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading APK:', error);
    throw error;
  }
};

import api from './axios';

export const uploadResumeFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/applications/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const applyToJob = async (jobId, applicationData) => {
  const response = await api.post(`/jobs/${jobId}/applications`, applicationData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data;
};

export const getApplicationsForJob = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/applications`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};

export const withdrawApplication = async (applicationId) => {
  const response = await api.delete(`/applications/${applicationId}`);
  return response.data;
};

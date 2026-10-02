import api from './axios';

export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateAdminUserStatus = async (userId, data) => {
  const response = await api.patch(`/admin/users/${userId}/status`, data);
  return response.data;
};

export const getAdminJobs = async (params = {}) => {
  const response = await api.get('/admin/jobs', { params });
  return response.data;
};

export const moderateAdminJobStatus = async (jobId, data) => {
  const response = await api.patch(`/admin/jobs/${jobId}/status`, data);
  return response.data;
};

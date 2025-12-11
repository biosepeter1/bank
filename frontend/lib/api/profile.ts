import apiClient from './client';

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/auth/me', data);
    return response.data;
  },
};

import apiClient from '../auth_services/apiClient';

export const analyzeRecycle = async (formData) => {
  const { data } = await apiClient.post(
    '/recycle/analyze',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return data;
      },
      timeout: 120000,
    }
  );
  return data;
};

export const generateRecycleIdea = async (sessionId, ideaId, model) => {
  const { data } = await apiClient.post(
    `/recycle/${sessionId}/generate/${ideaId}`,
    { model },
    { timeout: 120000 }
  );
  return data;
};

export const getRecycleSession = async (sessionId) => {
  const { data } = await apiClient.get(`/recycle/${sessionId}`);
  return data;
};

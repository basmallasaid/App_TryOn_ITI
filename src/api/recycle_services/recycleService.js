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
    }
  );
  return data;
};

export const generateRecycleIdea = async (sessionId, ideaId, model) => {
  const { data } = await apiClient.post(
    `/recycle/${sessionId}/generate/${ideaId}`,
    { model },
    {}
  );
  return data;
};

export const getRecycleSession = async (sessionId) => {
  const { data } = await apiClient.get(`/recycle/${sessionId}`);
  return data;
};

export const saveRecycleResult = async ({ imageUrl, designTitle, designTitleAr, designDescription, designDescriptionAr }) => {
  const { data } = await apiClient.post("/users/latest-recycle", {
    imageUrl,
    designTitle,
    designTitleAr,
    designDescription,
    designDescriptionAr,
  });
  return data;
};

export const getLatestRecycle = async () => {
  const { data } = await apiClient.get("/users/latest-recycle");
  return data;
};

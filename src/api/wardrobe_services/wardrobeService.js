import apiClient from '../auth_services/apiClient';

const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;

/**
 * Step 1 — Analyze image, returns analysis_id + garments[]
 * @param {string} imageBase64 
 * @param {string} mimeType   
 */
// export const analyzeGarment = async (imageBase64, mimeType = 'image/jpeg') => {
//   const { data } = await apiClient.post(
//     '/analyze',
//     { image: imageBase64},
//     {
//       headers: { 'x-hf-token': HF_TOKEN },
//       timeout: 60000,
//     }
//   );
//   return data; // { analysis_id, garments[], detectionType }
// };
export const analyzeGarment = async (formData) => {
  const { data } = await apiClient.post(
    '/analyze',
    formData, // Send the FormData object directly
    {
      headers: { 
        'x-hf-token': HF_TOKEN,
        'Content-Type': 'multipart/form-data', // Tell the server to expect a file
      },
      transformRequest: (data, headers) => {
        return data; // Required for Axios to handle FormData correctly in some environments
      },
      timeout: 60000,
    }
  );
  return data; 
};

/**
 * Step 2 — Save analyzed garment to wardrobe
 * @param {string} analysis_id
 * @param {number} garment_index — default 0 for single detection
 */
export const saveToWardrobe = async (analysis_id, garment_index = 0) => {
  const { data } = await apiClient.post('/wardrobe/from-analysis', {
    analysis_id,
    garment_index,
  });
  return data;
};

/**
 * Get all wardrobe items for the current user
 */
export const getWardrobeItems = async () => {
  const { data } = await apiClient.get('/wardrobe');
  return data.items; // array of wardrobe items
};

/**
 * Delete a wardrobe item by id
 */
export const deleteWardrobeItem = async (itemId) => {
  const { data } = await apiClient.delete(`/wardrobe/${itemId}`);
  return data;
};
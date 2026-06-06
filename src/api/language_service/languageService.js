import { ENDPOINTS } from "../../config/endpoints";
import apiClient from "../auth_services/apiClient";

export const updateLanguage = async (language) => {
  await apiClient.put(
    ENDPOINTS.SELECT_LANG,
    {
      language,
    }
  );

};
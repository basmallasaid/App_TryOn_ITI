import { ENDPOINTS } from "../../config/endpoints";
import apiClient from "../auth_services/apiClient";

export const syncLanguageToProfile = async (language) => {
  await apiClient.put(
    ENDPOINTS.SELECT_LANG,
    {
      language,
    }
  );

};
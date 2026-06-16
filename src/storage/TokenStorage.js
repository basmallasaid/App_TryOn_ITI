import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const ONBOARDING_KEY = 'onboarding_seen';
const LANGUAGE_KEY = 'app_language';
const USER_ID_KEY = 'user_id';


export const setOnboardingSeen = () =>
  SecureStore.setItemAsync(ONBOARDING_KEY, 'true');

export const getOnboardingSeen = () =>
  SecureStore.getItemAsync(ONBOARDING_KEY);

export const saveToken = (token) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken  = ()      => SecureStore.getItemAsync(TOKEN_KEY);
export const clearToken = ()     => SecureStore.deleteItemAsync(TOKEN_KEY);

export const saveLanguage = (lang) =>
  SecureStore.setItemAsync(LANGUAGE_KEY, lang);
 
export const getLanguage = () =>
  SecureStore.getItemAsync(LANGUAGE_KEY);
 
export const getLanguageSeen = () =>
  SecureStore.getItemAsync('language_seen');
 
export const setLanguageSeen = () =>
  SecureStore.setItemAsync('language_seen', 'true');
 
export const saveUserId = (id) => SecureStore.setItemAsync(USER_ID_KEY, id);
export const getUserId  = ()   => SecureStore.getItemAsync(USER_ID_KEY);
export const clearUserId = ()  => SecureStore.deleteItemAsync(USER_ID_KEY);

const THEME_KEY = 'app_theme';

export const saveTheme = (mode) =>
  SecureStore.setItemAsync(THEME_KEY, mode);

export const getTheme = () =>
  SecureStore.getItemAsync(THEME_KEY);

export {
  setWardrobeCache,
  getWardrobeCache,
  clearWardrobeCache,
  setProductsCache,
  getProductsCache,
  clearProductsCache,
  setDailyOutfitDate,
  getDailyOutfitDate,
  setDailyOutfitData,
  getDailyOutfitData,
  clearDailyOutfit,
  clearAllUserCache,
} from './AsyncStorageCache';
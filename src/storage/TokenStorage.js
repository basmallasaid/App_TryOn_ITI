import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const ONBOARDING_KEY = 'onboarding_seen';
const LANGUAGE_KEY = 'selected_language';

export const setOnboardingSeen = () =>
  SecureStore.setItemAsync(ONBOARDING_KEY, 'true');

export const getOnboardingSeen = () =>
  SecureStore.getItemAsync(ONBOARDING_KEY);

export const saveToken = (token) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken  = ()      => SecureStore.getItemAsync(TOKEN_KEY);
export const clearToken = ()     => SecureStore.deleteItemAsync(TOKEN_KEY);

export const saveLanguage = (language) =>
  SecureStore.setItemAsync(LANGUAGE_KEY, language);

export const getLanguage = () =>
  SecureStore.getItemAsync(LANGUAGE_KEY);

export const clearLanguage = () =>
  SecureStore.deleteItemAsync(LANGUAGE_KEY);
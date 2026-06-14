// src/utils/devReset.js
import * as SecureStore from 'expo-secure-store';

const isDev = __DEV__; // React Native built-in — true in dev, false in production

export const resetOnboardingAndLanguage = async () => {
  if (!isDev) {
    return;
  }
  await SecureStore.deleteItemAsync('onboarding_seen');
  //await SecureStore.deleteItemAsync('language_seen');
  //await SecureStore.deleteItemAsync('app_language');
  // await SecureStore.deleteItemAsync('user_id');
};
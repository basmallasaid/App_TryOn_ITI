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

const DAILY_OUTFIT_DATE_KEY = 'daily_outfit_date';
const DAILY_OUTFIT_DATA_KEY = 'daily_outfit_data';

const dailyKey = (key, userId) => userId ? `${key}_${userId}` : key;

export const setDailyOutfitDate = (date, userId) =>
  SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), date);

export const getDailyOutfitDate = (userId) =>
  SecureStore.getItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));

export const setDailyOutfitData = (data, userId) =>
  SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(data));

export const getDailyOutfitData = async (userId) => {
  const raw = await SecureStore.getItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));
  return raw ? JSON.parse(raw) : null;
};

export const clearDailyOutfit = (userId) =>
  SecureStore.deleteItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId))
    .then(() => SecureStore.deleteItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId)));

const THEME_KEY = 'app_theme';

export const saveTheme = (mode) =>
  SecureStore.setItemAsync(THEME_KEY, mode);

export const getTheme = () =>
  SecureStore.getItemAsync(THEME_KEY);

const WARDROBE_CACHE_KEY = 'wardrobe_cache';
const WARDROBE_TS_KEY = 'wardrobe_cache_ts';
const PRODUCTS_CACHE_KEY = 'products_cache';
const PRODUCTS_TS_KEY = 'products_cache_ts';
const CACHE_TTL = 30 * 60 * 1000;

const userKey = (key, userId) => userId ? `${key}_${userId}` : key;

export const setWardrobeCache = async (items, userId) => {
  await SecureStore.setItemAsync(userKey(WARDROBE_CACHE_KEY, userId), JSON.stringify(items));
  await SecureStore.setItemAsync(userKey(WARDROBE_TS_KEY, userId), String(Date.now()));
};

export const getWardrobeCache = async (userId) => {
  const raw = await SecureStore.getItemAsync(userKey(WARDROBE_CACHE_KEY, userId));
  const ts = await SecureStore.getItemAsync(userKey(WARDROBE_TS_KEY, userId));
  if (!raw || !ts) return null;
  if (Date.now() - Number(ts) > CACHE_TTL) return null;
  return JSON.parse(raw);
};

export const clearWardrobeCache = (userId) =>
  SecureStore.deleteItemAsync(userKey(WARDROBE_CACHE_KEY, userId))
    .then(() => SecureStore.deleteItemAsync(userKey(WARDROBE_TS_KEY, userId)));

export const setProductsCache = async (products, userId) => {
  await SecureStore.setItemAsync(userKey(PRODUCTS_CACHE_KEY, userId), JSON.stringify(products));
  await SecureStore.setItemAsync(userKey(PRODUCTS_TS_KEY, userId), String(Date.now()));
};

export const getProductsCache = async (userId) => {
  const raw = await SecureStore.getItemAsync(userKey(PRODUCTS_CACHE_KEY, userId));
  const ts = await SecureStore.getItemAsync(userKey(PRODUCTS_TS_KEY, userId));
  if (!raw || !ts) return null;
  if (Date.now() - Number(ts) > CACHE_TTL) return null;
  return JSON.parse(raw);
};

export const clearProductsCache = (userId) =>
  SecureStore.deleteItemAsync(userKey(PRODUCTS_CACHE_KEY, userId))
    .then(() => SecureStore.deleteItemAsync(userKey(PRODUCTS_TS_KEY, userId)));
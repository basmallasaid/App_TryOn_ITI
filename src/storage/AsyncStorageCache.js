import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_TTL = 30 * 60 * 1000;

const userKey = (key, userId) => userId ? `${key}_${userId}` : key;

export const setWardrobeCache = async (items, userId) => {
  try {
    await AsyncStorage.setItem(userKey('wardrobe_cache', userId), JSON.stringify(items));
    await AsyncStorage.setItem(userKey('wardrobe_cache_ts', userId), String(Date.now()));
  } catch (e) {
    console.log('AsyncStorageCache: setWardrobeCache failed', e.message);
  }
};

export const getWardrobeCache = async (userId) => {
  try {
    const raw = await AsyncStorage.getItem(userKey('wardrobe_cache', userId));
    const ts = await AsyncStorage.getItem(userKey('wardrobe_cache_ts', userId));
    if (!raw || !ts) return null;
    if (Date.now() - Number(ts) > CACHE_TTL) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.log('AsyncStorageCache: getWardrobeCache failed', e.message);
    return null;
  }
};

export const clearWardrobeCache = async (userId) => {
  try {
    await AsyncStorage.removeItem(userKey('wardrobe_cache', userId));
    await AsyncStorage.removeItem(userKey('wardrobe_cache_ts', userId));
  } catch (e) {
    console.log('AsyncStorageCache: clearWardrobeCache failed', e.message);
  }
};

export const setProductsCache = async (products, userId) => {
  try {
    await AsyncStorage.setItem(userKey('products_cache', userId), JSON.stringify(products));
    await AsyncStorage.setItem(userKey('products_cache_ts', userId), String(Date.now()));
  } catch (e) {
    console.log('AsyncStorageCache: setProductsCache failed', e.message);
  }
};

export const getProductsCache = async (userId) => {
  try {
    const raw = await AsyncStorage.getItem(userKey('products_cache', userId));
    const ts = await AsyncStorage.getItem(userKey('products_cache_ts', userId));
    if (!raw || !ts) return null;
    if (Date.now() - Number(ts) > CACHE_TTL) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.log('AsyncStorageCache: getProductsCache failed', e.message);
    return null;
  }
};

export const clearProductsCache = async (userId) => {
  try {
    await AsyncStorage.removeItem(userKey('products_cache', userId));
    await AsyncStorage.removeItem(userKey('products_cache_ts', userId));
  } catch (e) {
    console.log('AsyncStorageCache: clearProductsCache failed', e.message);
  }
};

const DAILY_OUTFIT_DATE_KEY = 'daily_outfit_date';
const DAILY_OUTFIT_DATA_KEY = 'daily_outfit_data';

const dailyKey = (key, userId) => userId ? `${key}_${userId}` : key;

export const setDailyOutfitDate = (date, userId) =>
  AsyncStorage.setItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), date);

export const getDailyOutfitDate = (userId) =>
  AsyncStorage.getItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));

export const setDailyOutfitData = async (data, userId) => {
  try {
    await AsyncStorage.setItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(data));
  } catch (e) {
    console.log('AsyncStorageCache: setDailyOutfitData failed', e.message);
  }
};

export const getDailyOutfitData = async (userId) => {
  try {
    const raw = await AsyncStorage.getItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log('AsyncStorageCache: getDailyOutfitData failed', e.message);
    return null;
  }
};

export const clearDailyOutfit = async (userId) => {
  try {
    await AsyncStorage.removeItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));
    await AsyncStorage.removeItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));
  } catch (e) {
    console.log('AsyncStorageCache: clearDailyOutfit failed', e.message);
  }
};

export const clearAllUserCache = async (userId) => {
  try {
    await clearWardrobeCache(userId);
    await clearProductsCache(userId);
    await clearDailyOutfit(userId);
  } catch (e) {
    console.log('AsyncStorageCache: clearAllUserCache failed', e.message);
  }
};

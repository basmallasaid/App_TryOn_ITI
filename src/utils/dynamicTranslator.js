import i18n from '../localization/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_CHARS = 500;
const REQUEST_TIMEOUT_MS = 10000;
const CACHE_KEY = '@translation_cache';

// Load cache from storage
let translationCache = {};
AsyncStorage.getItem(CACHE_KEY).then(data => {
  if (data) translationCache = JSON.parse(data);
});

async function saveCache() {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
}

// ... rest of the functions

/**
 * Split text into chunks of at most MAX_CHUNK_CHARS, breaking at sentence boundaries.
 */
function splitIntoChunks(text) {
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK_CHARS) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, MAX_CHUNK_CHARS)];
}

/**
 * Translate a single chunk (≤500 chars) to Arabic via MyMemory.
 */
async function translateChunk(chunk, targetLang) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      q: chunk,
      langpair: `en|${targetLang}`,
      de: "redolapy.admin@gmail.com",
    });

    const res = await fetch(`${MYMEMORY_ENDPOINT}?${params}`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[DynamicTranslation] Chunk failed (${res.status})`);
      return chunk;
    }

    const data = await res.json();
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return chunk;
  } catch (err) {
    clearTimeout(timeout);
    console.warn("[DynamicTranslation] Chunk call failed:", err.message);
    return chunk;
  }
}

/**
 * Translate a single English text string to a target language (default: current app locale) using MyMemory.
 */
export async function translateToArabic(text, targetLang = i18n.language) {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  if (targetLang !== "ar") return text; // If not translating to Arabic, return original

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const chunks = splitIntoChunks(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, targetLang));
    }

    const translated = translatedChunks.join(" ");
    translationCache[cacheKey] = translated;
    saveCache(); // Persist cache
    return translated;
  } catch (error) {
    console.warn("[DynamicTranslation] Translation overall failed:", error.message);
    return text;
  }
}

/**
 * Translates product details on the fly.
 */
export async function translateProduct(product, targetLang = i18n.language) {
  if (!product || targetLang !== "ar") return product;

  try {
    const [nameAr, descAr] = await Promise.all([
      translateToArabic(product.name, targetLang),
      translateToArabic(product.description, targetLang),
    ]);

    return {
      ...product,
      name: nameAr || product.name,
      description: descAr || product.description,
    };
  } catch (err) {
    return product;
  }
}

/**
 * Translates match suggestions and explanations.
 */
export async function translateMatch(match, targetLang = i18n.language) {
  if (!match || targetLang !== "ar") return match;

  try {
    const [itemNameAr, explanationAr, itemDescAr] = await Promise.all([
      translateToArabic(match.item?.name, targetLang),
      translateToArabic(match.explanation, targetLang),
      translateToArabic(match.item?.description, targetLang),
    ]);

    return {
      ...match,
      explanation: explanationAr || match.explanation,
      item: match.item
        ? {
            ...match.item,
            name: itemNameAr || match.item.name,
            description: itemDescAr || match.item.description,
          }
        : undefined,
    };
  } catch (err) {
    return match;
  }
}

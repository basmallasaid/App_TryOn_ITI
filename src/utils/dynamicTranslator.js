import i18n from '../localization/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_CHARS = 500;
const CACHE_KEY = '@translation_cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

let translationCache = {};
let cacheLoaded = false;
let cacheLoadPromise = AsyncStorage.getItem(CACHE_KEY).then(data => {
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const now = Date.now();
      const filtered = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value.ts && now - value.ts < CACHE_TTL) {
          filtered[key] = value;
        }
      }
      translationCache = filtered;
    } catch (e) {
      translationCache = {};
    }
  }
  cacheLoaded = true;
}).catch(() => {
  cacheLoaded = true;
});

async function waitForCache() {
  if (cacheLoaded) return;
  await cacheLoadPromise;
}

async function saveCache() {
  try {
    const entries = Object.entries(translationCache);
    if (entries.length > MAX_CACHE_ENTRIES) {
      const sorted = entries.sort((a, b) => (b[1].ts || 0) - (a[1].ts || 0));
      const kept = sorted.slice(0, MAX_CACHE_ENTRIES);
      translationCache = Object.fromEntries(kept);
    }
    const toSave = {};
    for (const [key, value] of Object.entries(translationCache)) {
      toSave[key] = { text: value.text, ts: value.ts || Date.now() };
    }
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.log('dynamicTranslator: saveCache failed', e.message);
  }
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
  try {
    const params = new URLSearchParams({
      q: chunk,
      langpair: `en|${targetLang}`,
      de: "redolapy.admin@gmail.com",
    });

    const res = await fetch(`${MYMEMORY_ENDPOINT}?${params}`, {
      method: "GET",
    });

    if (!res.ok) {
      return chunk;
    }

    const data = await res.json();
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return chunk;
  } catch (err) {
    return chunk;
  }
}

/**
 * Translate a single English text string to a target language (default: current app locale) using MyMemory.
 */
export async function translateToArabic(text, targetLang = i18n.language) {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  if (targetLang !== "ar") return text;

  await waitForCache();

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey].text;
  }

  try {
    const chunks = splitIntoChunks(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, targetLang));
    }

    const translated = translatedChunks.join(" ");
    translationCache[cacheKey] = { text: translated, ts: Date.now() };
    saveCache();
    return translated;
  } catch (error) {
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

/**
 * Translates notification title and body.
 */
export async function translateNotification(notification, targetLang = i18n.language) {
  if (!notification || targetLang !== "ar") return notification;

  try {
    const [titleAr, bodyAr] = await Promise.all([
      translateToArabic(notification.title, targetLang),
      translateToArabic(notification.body, targetLang),
    ]);

    return {
      ...notification,
      title: titleAr || notification.title,
      body: bodyAr || notification.body,
    };
  } catch (err) {
    return notification;
  }
}

/**
 * Translates wardrobe item name, category, season, style, and color.
 */
export async function translateWardrobeItem(item, targetLang = i18n.language) {
  if (!item || targetLang !== "ar") return item;

  try {
    const [nameAr, seasonAr, styleAr, colorAr, specificTypeAr] = await Promise.all([
      translateToArabic(item.name, targetLang),
      translateToArabic(Array.isArray(item.season) ? item.season.join(", ") : item.season, targetLang),
      translateToArabic(item.style, targetLang),
      translateToArabic(item.garments?.[0]?.colors?.[0]?.color, targetLang),
      translateToArabic(item.garments?.[0]?.specificType, targetLang),
    ]);

    const translatedSeason = seasonAr && Array.isArray(item.season)
      ? seasonAr.split(", ").map(s => s.trim())
      : item.season;

    return {
      ...item,
      name: nameAr || item.name,
      category: item.category,
      season: translatedSeason || item.season,
      style: styleAr || item.style,
      garments: item.garments
        ? item.garments.map(g => ({
            ...g,
            specificType: specificTypeAr || g.specificType,
            colors: g.colors
              ? g.colors.map(c => ({ ...c, color: colorAr || c.color }))
              : g.colors,
          }))
        : item.garments,
    };
  } catch (err) {
    return item;
  }
}

/**
 * Translates recommendation outfit items (names, breakdown keys).
 */
export async function translateRecommendation(outfit, targetLang = i18n.language) {
  if (!outfit || targetLang !== "ar") return outfit;

  try {
    const items = outfit.items || outfit.outfits?.[0]?.items || [];
    const translatedItems = await Promise.all(
      items.map(async (item) => {
        const nameAr = await translateToArabic(item.name, targetLang);
        return { ...item, name: nameAr || item.name };
      })
    );

    if (outfit.outfits?.[0]) {
      return {
        ...outfit,
        outfits: [{ ...outfit.outfits[0], items: translatedItems }],
      };
    }

    return { ...outfit, items: translatedItems };
  } catch (err) {
    return outfit;
  }
}

/**
 * Translates recycle design idea title and description.
 */
export async function translateDesignIdea(idea, targetLang = i18n.language) {
  if (!idea || targetLang !== "ar") return idea;

  try {
    const [titleAr, descAr] = await Promise.all([
      translateToArabic(idea.title, targetLang),
      translateToArabic(idea.design_description, targetLang),
    ]);

    return {
      ...idea,
      title_ar: titleAr || idea.title_ar,
      design_description_ar: descAr || idea.design_description_ar,
    };
  } catch (err) {
    return idea;
  }
}

/**
 * Translates a list of items in batch using the MyMemory endpoint.
 * Useful for translating arrays of dynamic data.
 */
export async function translateBatch(items, translatorFn, targetLang = i18n.language) {
  if (!items || !Array.isArray(items) || targetLang !== "ar") return items;

  const results = [];
  for (const item of items) {
    results.push(await translatorFn(item, targetLang));
  }
  return results;
}
